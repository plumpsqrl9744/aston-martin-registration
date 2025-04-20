"use client";

import { useState, useEffect } from "react";
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
  { id: "dbx707", name: "dbx707", image: "/models/dbx707.png" },
  { id: "valhalla", name: "valhalla", image: "/models/valhalla.png" },
  {
    id: "vanquish-coupe",
    name: "vanquish coupe",
    image: "/models/vanquish-coupe.png",
  },
  {
    id: "vanquish-volante",
    name: "vanquish volante",
    image: "/models/vanquish-volante.png",
  },
  {
    id: "vantage-coupe",
    name: "vantage coupe",
    image: "/models/vantage-coupe.png",
  },
  {
    id: "vantage-roadster",
    name: "vantage roadster",
    image: "/models/vantage-roadster.png",
  },
];

console.log(
  "Image paths:",
  carModels.map((model) => model.image)
);

async function submitEventForm(data: FormValues) {
  const response = await fetch("/api/event-reception", {
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
  value: "male" | "female";
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

// 체크박스 스타일 추가
const checkboxClassName = `
  form-checkbox
  h-5
  w-5
  text-[#00665e]
  border-2
  border-gray-200
  rounded-sm
  transition-all
  duration-200
  ease-in-out
  focus:ring-0
  focus:ring-offset-0
  hover:border-[#00665e]
  checked:bg-[#00665e]
  checked:border-[#00665e]
  cursor-pointer
`;

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const {
    mutate,
    isPending: isLoading,
    isError,
    error,
  } = useMutation({
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
    console.log("asd", data);
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
    h-10
    w-full
    px-0
    sm:text-sm
    text-gray-900
    placeholder-gray-400
    bg-transparent
    border-0
    border-b-2
    border-gray-200
    focus:ring-0
    focus:border-[#00665e]
    transition-colors
    outline-none
    hover:border-[#00665e]/50
  `;

  const radioClassName = `form-radio focus:ring-0 focus:ring-offset-0 h-5 w-5 text-gray-900 border-gray-300 outline-none cursor-pointer ${
    isMounted ? "mounted" : ""
  }`;

  const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const isFormValid = () => {
    const values = watch();
    return (
      values.koreanName &&
      values.englishName &&
      values.gender &&
      values.phoneNumber &&
      values.email &&
      selectedModel && // selectedModel 상태값으로도 체크
      values.interestedModel &&
      values.privacyAgreement &&
      Object.keys(errors).length === 0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Image
            src="/logo.png"
            alt="Aston Martin Logo"
            width={350}
            height={60}
            priority
            className="mx-auto"
          />
          <h1 className="text-3xl font-extrabold text-black sm:text-4xl font-aston">
            Aston Martin Test Drive Event
          </h1>
          <p className="mt-3 text-xl text-black">
            Discover the Art of Performance
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-8 sm:p-10">
            <div className="grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-2">
              {/* 국문 성함 */}
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

              {/* 영문 성함 */}
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

              {/* 성별 */}
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
                      {({ checked }: RadioOptionProps) => (
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
                      {({ checked }: RadioOptionProps) => (
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

              {/* 핸드폰 번호 */}
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

              {/* 이메일 주소 */}
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

              {/* 관심 차종 */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  관심 차종 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {carModels.map((model) => (
                    <div
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setValue("interestedModel", model.id); // 여기서 form 값도 함께 업데이트
                      }}
                      className={`relative rounded-lg border-2 cursor-pointer transition-all overflow-hidden ${
                        selectedModel === model.id
                          ? "border-[#00665e] ring-[#00665e]"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <div className="relative w-full pt-[75%]">
                        <Image
                          src={model.image}
                          alt={model.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="absolute inset-0 object-contain w-full h-full transition-all duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <h3 className="text-white font-medium text-sm sm:text-base font-racing">
                          {model.name}
                        </h3>
                      </div>
                      <input
                        type="radio"
                        className="sr-only"
                        id={`model-${model.id}`}
                        value={model.id}
                        {...register("interestedModel", {
                          required: "관심 차종을 선택해주세요",
                        })}
                        checked={selectedModel === model.id}
                        onChange={(e) => {
                          setSelectedModel(e.target.value);
                          setValue("interestedModel", e.target.value);
                        }}
                      />
                    </div>
                  ))}
                </div>
                {errors.interestedModel && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.interestedModel.message}
                  </p>
                )}
              </div>

              {/* 개인정보 수집 및 이용동의 */}
              <div className="sm:col-span-2 mt-4">
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    개인정보 수집 및 이용 동의
                  </h3>
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
                    <span className="text-red-500 ml-1">*</span>
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
                // disabled={isLoading || !isFormValid()}
                className={`
                  w-full
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
          </form>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Aston Martin. All rights reserved.
        </div>
      </div>
    </div>
  );
}
