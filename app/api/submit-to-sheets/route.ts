import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 설문 조사 횟수 제한 검증
    const submissionLimitCheck = checkSubmissionLimit(data.clientId);
    if (!submissionLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, error: submissionLimitCheck.message },
        { status: 429 } // Too Many Requests 상태 코드
      );
    }

    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      throw new Error("Google Script URL이 설정되지 않았습니다.");
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // 제출 성공 시 횟수 증가
    if (result.result === "success" || result.success) {
      incrementSubmissionCount(data.clientId);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("오류 발생:", error);
    return NextResponse.json(
      { success: false, error: "데이터 전송 실패" },
      { status: 500 }
    );
  }
}

// 설문 조사 횟수 제한 확인 함수
function checkSubmissionLimit(clientId: string): {
  allowed: boolean;
  message: string;
} {
  // 현재 시간 기준 1년 전 날짜 계산
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  try {
    // IP 대신 클라이언트 ID로 저장된 제출 기록 가져오기
    const submissionKey = `survey_submissions_${clientId || "anonymous"}`;
    const submissionsStr = global.localStorage?.getItem(submissionKey);

    if (!submissionsStr) {
      return { allowed: true, message: "제출 가능" };
    }

    // 제출 기록 파싱
    const submissions = JSON.parse(submissionsStr);

    // 지난 1년간의 제출만 필터링
    const recentSubmissions = submissions.filter(
      (timestamp: string) => new Date(timestamp) > oneYearAgo
    );

    if (recentSubmissions.length >= 5) {
      return {
        allowed: false,
        message: "1년 동안 최대 5회까지만 설문 조사에 참여할 수 있습니다.",
      };
    }

    return { allowed: true, message: "제출 가능" };
  } catch (error) {
    console.error("제출 제한 확인 중 오류 발생:", error);
    return { allowed: true, message: "제출 가능" }; // 오류 시 허용 (이중 보안으로 클라이언트에서도 체크)
  }
}

// 제출 횟수 증가 함수
function incrementSubmissionCount(clientId: string): void {
  try {
    const submissionKey = `survey_submissions_${clientId || "anonymous"}`;
    const submissionsStr = global.localStorage?.getItem(submissionKey);

    // 기존 제출 기록 불러오기
    const submissions = submissionsStr ? JSON.parse(submissionsStr) : [];

    // 현재 제출 시간 추가
    submissions.push(new Date().toISOString());

    // 업데이트된 제출 기록 저장
    global.localStorage?.setItem(submissionKey, JSON.stringify(submissions));
  } catch (error) {
    console.error("제출 횟수 업데이트 중 오류 발생:", error);
  }
}
