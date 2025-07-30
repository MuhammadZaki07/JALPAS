"use client";

import NavbarWidget from "@/app/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { navigateLaporan } from "../actions";

export default function UploadReport() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    title: { message: string };
    description: { message: string };
    file: { message: string };
  }>();
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    // Display loading indicator while uploading
    setUploading(true);

    // Create FormData object for multipart form data
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("file", data.file[0]);

    try {
      // Make API call to POST /reports/
      const response = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Redirect to the homepage if the report is successfully uploaded
        navigateLaporan();
      } else {
        // Handle error
        toast({
          variant: "destructive",
          title: "Gagal",
          description: "Gagal memperbarui laporan. Silakan coba lagi!",
        });
      }
    } catch (error) {
      console.error("Error uploading report:", error);
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Gagal memperbarui laporan. Silakan coba lagi!",
      });
    } finally {
      // Reset loading indicator after the API call is complete
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch min-h-screen">
      <NavbarWidget />

      <main className="container mx-auto px-6 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a
                  href="/laporan"
                  className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Laporan
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    Unggah
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl flex items-center justify-center text-white shadow-lg">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Unggah Laporan
            </h1>
            <p className="text-gray-600 text-lg">
              Bagikan laporan Anda dengan mudah dan cepat
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Judul Laporan
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("title", { required: "Judul wajib diisi" })}
                      className={`w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                        errors.title
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="Masukkan judul laporan yang jelas dan deskriptif..."
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.title && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.title.message?.toString()}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Deskripsi
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      {...register("description", {
                        required: "Deskripsi wajib diisi",
                      })}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none ${
                        errors.description
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="Berikan deskripsi singkat tentang isi laporan..."
                    />
                    <div className="absolute top-3 right-0 pr-3 flex items-start pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.description && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.description.message?.toString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">File PDF</h3>
                    <p className="text-sm text-gray-600">
                      Pilih file PDF yang akan diunggah
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Wajib
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div
                  className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                    errors.file
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  <input
                    type="file"
                    {...register("file", {
                      required: "PDF file wajib diisi",
                      validate: {
                        isPdf: (fileList: any) =>
                          fileList[0]?.type === "application/pdf" ||
                          "Hanya file PDF yang diperbolehkan",
                      },
                    })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf"
                  />

                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l3 3m0 0l3-3m-3 3V9"
                        />
                      </svg>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Pilih File PDF
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Seret dan lepas file PDF di sini, atau klik untuk memilih
                      file
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Format: PDF
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2m-6 0h8m-8 0a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2"
                          />
                        </svg>
                        Max: 5MB
                      </div>
                    </div>
                  </div>
                </div>

                {errors.file && (
                  <div className="flex items-center gap-2 text-red-600 text-sm mt-3">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.file.message?.toString()}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Panduan Unggah Laporan
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Pastikan file dalam format PDF dan dapat dibaca</li>
                    <li>• Gunakan judul yang jelas dan deskriptif</li>
                    <li>• Berikan deskripsi singkat tentang isi laporan</li>
                    <li>• Ukuran file maksimal 10MB</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <a
                href="/laporan"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Batal
              </a>

              <button
                type="submit"
                disabled={uploading}
                className={`inline-flex items-center justify-center px-8 py-3 font-medium rounded-xl ${
                  uploading
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                }`}
              >
                {uploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Unggah Laporan
                  </>
                )}
              </button>
            </div>
          </form>
          <Toaster />
        </div>
      </main>
    </div>
  );
}
