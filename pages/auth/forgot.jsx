import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from "next/link";

import { instance } from 'helpers/axios';
import authImg from "public/assets/img/auth/auth-reset.jpg";

export default function ForgotPassword() {
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                await generateResetPasswordToken({ email: values.email });
                alert('An email has been sent with instructions to reset your password.');
                setSuccess(true);
            } catch (error) {
                console.log(error.message);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const generateResetPasswordToken = async (data) => {
        instance.post('/users/reset/generate', data)
            .then((res) => {
            }).catch(error => {
                console.log(error.message);
            });
    };

    return (
        <div className='relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900'>
            <main className="mx-auto min-h-screen">
                <div className="relative flex">
                    <div className="mx-auto flex w-full justify-start pt-12 md:max-w-[75%] lg:max-w-[1013px] min-h-screen lg:pt-0 xl:max-w-[1383px] xl:px-0 pl-0 no-scrollbar">
                        <div className="flex flex-col pl-5 pr-5 lg:max-w-[48%] w-full xl:max-w-full">
                            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:items-center lg:justify-start">
                                <div className="w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:pl-[70px] pt-10 pb-10 lg:max-w-[420px] xl:max-w-[580px]">
                                    <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                                        Forgot Password
                                    </h4>
                                    <p className="mb-9 ml-1 text-base text-gray-600">
                                        Enter your email and password to reset your password!
                                    </p>
                                    <form onSubmit={formik.handleSubmit}>
                                        <label className="text-sm text-navy-700 dark:text-white font-medium" htmlFor="email">Email*</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email} />
                                        {formik.touched.email && formik.errors.email ? (
                                            <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.email}</div>
                                        ) : null}
                                        <button type="submit" className="linear mt-6 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" disabled={formik.isSubmitting}>Reset password</button>
                                    </form>
                                    <div className="mt-4 px-2">
                                        <Link
                                            href="/auth/login"
                                            className="ml-1 text-sm font-medium text-brand-300 hover:text-brand-600 dark:text-white transition"
                                        >
                                            Back to Login
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
                                <div
                                    className="absolute flex h-full w-full items-end justify-center bg-cover bg-center bg-contain bg-no-repeat bg-right-bottom"
                                    style={{ backgroundImage: `url(${authImg.src})` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}