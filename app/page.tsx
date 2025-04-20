"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { RadioGroup, Switch } from "@headlessui/react";

type FormValues = {
  koreanName: string;
  englishName: string;
  gender: "male" | "female";
  phoneNumber: string;
  email: string;
  interestedModel: string;
  privacyAgreement: boolean;
};

type CarModel = {
  id: string;
  name: string;
  image: string;
};

const carModels: CarModel[] = [
  { id: "db12-coupe", name: "DB12 Coupe", image: "/models/db12-coupe.png" },
  {
    id: "db12-volante",
    name: "DB12 Volante",
    image: "/models/db12-volante.png",
  },
  { id: "dbx707", name: "DBX707", image: "/models/dbx707.png" },
  { id: "valhalla", name: "Valhalla", image: "/models/valhalla.png" },
  {
    id: "vanquish-coupe",
    name: "Vanquish Coupe",
    image: "/models/vanquish-coupe.png",
  },
  {
    id: "vanquish-volante",
    name: "Vanquish Volante",
    image: "/models/vanquish-volante.png",
  },
  {
    id: "vantage-coupe",
    name: "Vantage Coupe",
    image: "/models/vantage-coupe.png",
  },
  {
    id: "vantage-roadster",
    name: "vantage roadster",
    image: "/models/vantage-roadster.png",
  },
];

async function submitEventForm(data: FormValues) {
  const response = await fetch("/api/submit-to-sheets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("폼 제출에 실패했습니다.");
  }

  return response.json();
}

type RadioOptionProps = {
  checked: boolean;
  value?: "male" | "female";
};

// 전화번호 포맷팅 함수 수정
const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength <= 3) return phoneNumber;
  if (phoneNumberLength <= 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
    3,
    7
  )}-${phoneNumber.slice(7, 11)}`;
};

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      gender: undefined,
    },
  });

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: submitEventForm,
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error) => {
      console.error("폼 제출 중 오류 발생:", error);
      alert("폼 제출에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // 클라이언트 ID 생성 (브라우저 지문 간단 버전)
    const generateClientId = () => {
      const nav = window.navigator;
      const screen = window.screen;
      const guid = nav.userAgent + screen.height + screen.width + nav.language;
      return btoa(guid).substring(0, 32); // 간단한 해시
    };

    // 설문 제출 횟수 체크
    const checkSubmissionLimit = () => {
      const clientId = generateClientId();
      const submissionKey = `survey_submissions_${clientId}`;
      const submissionsStr = localStorage.getItem(submissionKey);

      if (!submissionsStr) {
        return { allowed: true };
      }

      const submissions = JSON.parse(submissionsStr);

      // 1년 전 날짜 계산
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      // 지난 1년간의 제출만 필터링
      const recentSubmissions = submissions.filter(
        (timestamp: string) => new Date(timestamp) > oneYearAgo
      );

      return {
        allowed: recentSubmissions.length < 5,
        count: recentSubmissions.length,
      };
    };

    const submissionCheck = checkSubmissionLimit();
    if (!submissionCheck.allowed) {
      alert(
        `1년 동안 최대 5회까지만 설문 조사에 참여할 수 있습니다. 현재 ${submissionCheck.count}회 참여했습니다.`
      );
      return;
    }

    // 클라이언트 ID를 폼 데이터에 추가
    const dataWithClientId = {
      ...data,
      clientId: generateClientId(),
    };

    // 기존 mutate 함수 호출 수정
    mutate(dataWithClientId);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#00665e] mb-4">
              신청이 완료되었습니다
            </h2>
            <p className="text-gray-600 mb-6">
              아스톤 마틴 시승행사에 관심을 가져주셔서 감사합니다. 빠른 시일
              내에 담당자가 연락드릴 예정입니다.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 bg-[#00665e] text-white rounded hover:bg-[#005349] transition"
            >
              다시 작성하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inputClassName = `
    form-input
    h-11
    w-full
    px-0
    text-gray-800
    placeholder-gray-500
    bg-transparent
    border-0
    border-b-2
    border-gray-300
    focus:ring-0
    focus:border-[#00665e]
    transition-colors
    outline-none
    hover:border-[#00665e]/50
    font-medium
  `;

  const isFormValid = () => {
    const values = watch();
    return (
      values.koreanName &&
      values.englishName &&
      values.gender &&
      values.phoneNumber &&
      values.email &&
      selectedModels.length > 0 &&
      values.interestedModel &&
      values.privacyAgreement &&
      Object.keys(errors).length === 0
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-[#00665e] to-[#00897b] flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 bg-pattern"></div>
            <Image
              src="/logo.png"
              alt="Aston Martin"
              width={180}
              height={60}
              className="relative z-10 object-contain"
            />
          </div>

          <div className="p-6 sm:p-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
              아스톤 마틴 시승 신청
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              아스톤 마틴의 럭셔리한 드라이빙 경험을 직접 체험해보세요.
            </p>

            <div className="grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="koreanName"
                  className="block text-sm font-medium text-gray-700"
                >
                  국문 성함 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="koreanName"
                    {...register("koreanName", {
                      required: "국문 성함을 입력해주세요",
                    })}
                    className={inputClassName}
                  />
                  {errors.koreanName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.koreanName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="englishName"
                  className="block text-sm font-medium text-gray-700"
                >
                  영문 성함 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="englishName"
                    {...register("englishName", {
                      required: "영문 성함을 입력해주세요",
                    })}
                    className={inputClassName}
                  />
                  {errors.englishName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.englishName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  성별 <span className="text-red-500">*</span>
                </label>
                <RadioGroup
                  value={watch("gender") || ""}
                  onChange={(value: "male" | "female") =>
                    setValue("gender", value)
                  }
                  className="mt-2"
                >
                  <div className="space-x-6 flex h-12 items-center">
                    <RadioGroup.Option
                      value="male"
                      className="flex items-center"
                    >
                      {({ checked }) => (
                        <>
                          <input
                            type="radio"
                            checked={checked}
                            readOnly
                            className="form-radio h-5 w-5 text-black border-gray-300 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                          <label className="ml-3 block text-sm text-gray-700">
                            남성
                          </label>
                        </>
                      )}
                    </RadioGroup.Option>

                    <RadioGroup.Option
                      value="female"
                      className="flex items-center"
                    >
                      {({ checked }) => (
                        <>
                          <input
                            type="radio"
                            checked={checked}
                            readOnly
                            className="form-radio h-5 w-5 text-black border-gray-300 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          />
                          <label className="ml-3 block text-sm text-gray-700">
                            여성
                          </label>
                        </>
                      )}
                    </RadioGroup.Option>
                  </div>
                </RadioGroup>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  핸드폰 번호 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="phoneNumber"
                    placeholder="010-0000-0000"
                    maxLength={13}
                    {...register("phoneNumber", {
                      required: "핸드폰 번호를 입력해주세요",
                      pattern: {
                        value: /^\d{3}-\d{3,4}-\d{4}$/,
                        message: "010-0000-0000 형식으로 입력해주세요",
                      },
                      onChange: (e) => {
                        const formatted = formatPhoneNumber(
                          e.target.value.replace(/[^0-9]/g, "")
                        );
                        e.target.value = formatted;
                      },
                    })}
                    className={inputClassName}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  이메일 주소 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      required: "이메일을 입력해주세요",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "유효한 이메일 주소를 입력해주세요",
                      },
                    })}
                    className={inputClassName}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  관심 차종 <span className="text-red-500">*</span>
                </label>
                <div className="mt-3 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
                  {carModels.map((model) => (
                    <div key={model.id} className="relative">
                      <div
                        className={`
                          border rounded-lg p-4 cursor-pointer transition-all duration-300
                          shadow-sm hover:shadow-md
                          ${
                            selectedModels.includes(model.id)
                              ? "border-[#00665e] bg-gradient-to-br from-white to-[#00665e]/5"
                              : "border-gray-200 hover:border-[#00665e]/30 bg-white"
                          }
                        `}
                        onClick={() => {
                          const newSelectedModels = selectedModels.includes(
                            model.id
                          )
                            ? selectedModels.filter((id) => id !== model.id)
                            : [...selectedModels, model.id];

                          setSelectedModels(newSelectedModels);
                          setValue(
                            "interestedModel",
                            newSelectedModels.join(",")
                          );
                        }}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className=" rounded-lg w-full mb-3 flex justify-center items-center h-28">
                            <Image
                              src={model.image}
                              alt={model.name}
                              width={160}
                              height={100}
                              className="object-contain transition-all duration-500 hover:scale-105"
                            />
                          </div>
                          <span className="block text-sm font-bold text-gray-800">
                            {model.name}
                          </span>
                        </div>
                        {selectedModels.includes(model.id) && (
                          <div className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-[#00665e] text-white shadow-sm">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.interestedModel && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.interestedModel.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 mt-4">
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="flex">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      개인정보 수집 및 이용 동의
                    </h3>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <div className="text-xs text-gray-500 h-24 overflow-y-auto p-2 border border-gray-200 rounded bg-white">
                    <p className="mb-2">
                      아스톤 마틴은 시승 서비스 제공을 위해 아래와 같이
                      개인정보를 수집 및 이용합니다.
                    </p>
                    <p className="mb-2">
                      1. 수집항목: 성명(국/영문), 성별, 연락처, 이메일, 관심
                      차종
                    </p>
                    <p className="mb-2">
                      2. 수집 및 이용목적: 시승 신청 및 서비스 제공, 마케팅 활용
                    </p>
                    <p className="mb-2">
                      3. 보유 및 이용기간: 수집일로부터 3년
                    </p>
                    <p>
                      귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가
                      있으나, 동의 거부 시 시승 서비스 이용이 제한됩니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Switch
                    checked={watch("privacyAgreement") || false}
                    onChange={(checked: boolean) =>
                      setValue("privacyAgreement", checked)
                    }
                    className={`
                      relative 
                      inline-flex 
                      h-5 
                      w-5 
                      items-center 
                      justify-center
                      rounded-sm
                      border-2
                      transition-colors
                      duration-200
                      ease-in-out
                      ${
                        watch("privacyAgreement")
                          ? "bg-[#00665e] border-[#00665e]"
                          : "bg-white border-gray-200 hover:border-[#00665e]"
                      }
                    `}
                  >
                    <span className="sr-only">개인정보 수집 및 이용 동의</span>
                    {watch("privacyAgreement") && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </Switch>
                  <div className="flex items-center">
                    <label
                      className="text-sm font-medium text-gray-700 select-none cursor-pointer"
                      onClick={() =>
                        setValue("privacyAgreement", !watch("privacyAgreement"))
                      }
                    >
                      개인정보 수집 및 이용에 동의합니다
                    </label>
                  </div>
                </div>
                {errors.privacyAgreement && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.privacyAgreement.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading || !isFormValid()}
                className={`                  w-full
                  flex
                  justify-center
                  py-4
                  px-4
                  border
                  border-[#00665e]
                  rounded-md
                  text-sm
                  font-medium
                  text-white
                  ${
                    isFormValid()
                      ? "bg-[#00665e]"
                      : "bg-gray-400 border-gray-400"
                  }
                  transition-all
                  duration-300
                  ease-in-out
                  transform
                  ${
                    isFormValid()
                      ? "hover:bg-[#005349] hover:scale-[0.99] active:scale-95"
                      : ""
                  }
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-[#00665e]
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  disabled:transform-none
                  disabled:transition-none
                `}
              >
                {isLoading ? "처리중..." : "신청하기"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Aston Martin. All rights reserved.
        </div>
      </div>
    </div>
  );
}
