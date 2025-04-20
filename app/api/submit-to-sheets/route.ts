import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // localStorage 관련 코드 제거 (서버에서는 사용 불가)
    // 클라이언트에서 이미 검증했으므로 추가 검증 생략

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

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

    if (!response.ok) {
      throw new Error("Google Apps Script 응답 오류");
    }

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error("오류 발생:", error);
    return NextResponse.json(
      {
        success: false,
        error: "데이터 전송 실패",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
