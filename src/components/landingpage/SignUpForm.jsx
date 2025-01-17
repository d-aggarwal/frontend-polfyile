import React from "react";

const SignUpForm = ({ handleLoginClick }) => {
  const handleGuestLogin = () => {
    console.log("Logged in as Guest");
  };

  return (
    <div className="w-full max-w-[500px] bg-white shadow-lg rounded-lg p-4 sm:p-5 md:p-6">
      <p className="text-center font-bold text-xl sm:text-2xl mb-4 sm:mb-6 md:mb-8">Create account</p>
      <p className="text-sm text-gray-600 mb-2 sm:mb-3 ml-1">Let's get started</p>
      <form className="flex flex-col gap-3 sm:gap-4 mb-4">
        <input
          type="text"
          className="rounded-full border border-gray-300 p-2 sm:p-3 outline-none"
          placeholder="Name"
        />
        <input
          type="email"
          className="rounded-full border border-gray-300 p-2 sm:p-3 outline-none"
          placeholder="Email"
        />
        <input
          type="password"
          className="rounded-full border border-gray-300 p-2 sm:p-3 outline-none"
          placeholder="Password"
        />
        <button className="bg-blue-500 text-white rounded-full py-2 sm:py-3 shadow-md">
          Create account
        </button>
      </form>
      <p className="text-center text-sm sm:text-base text-gray-500">
        Already have an account?{" "}
        <button
          className="text-blue-500 underline cursor-pointer"
          onClick={handleLoginClick}
        >
          Log in
        </button>
      </p>

      <div className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-5">
        <div className="bg-white text-black rounded-full py-2 sm:py-3 flex justify-center items-center gap-3 sm:gap-5 cursor-pointer border-2 border-gray-400 text-sm sm:text-base">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
            alt="Facebook logo"
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
          Sign up with Facebook
        </div>
        <div className="bg-white text-black rounded-full py-2 sm:py-3 flex justify-center items-center gap-2 sm:gap-3 cursor-pointer border-2 border-gray-400 text-sm sm:text-base">
          <div>
            <svg
              viewBox="0 0 256 262"
              preserveAspectRatio="xMidYMid"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-auto sm:h-6 pr-2 sm:pr-3"
            >
              <path
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                fill="#4285F4"
              ></path>
              <path
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                fill="#34A853"
              ></path>
              <path
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                fill="#FBBC05"
              ></path>
              <path
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                fill="#EB4335"
              ></path>
            </svg>
          </div>
          Sign up with Google
        </div>
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <button
          className="text-blue-400 text-lg sm:text-xl font-semibold underline cursor-pointer"
          onClick={handleGuestLogin}
        >
          Enter as Guest
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;