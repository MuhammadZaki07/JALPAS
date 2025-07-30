"use client";

import NavbarWidget from "@/app/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Circles } from "react-loader-spinner";
import { navigateLaporan } from "../../actions";

type Props = {
  params: { slug: string };
};

export default function UploadReport({ params }: Props) {
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
  const [report, setReport] = useState<any | null>(null);
  const { toast } = useToast();

  // set initial value for title and description
  useEffect(() => {
    fetch("/api/reports/" + params.slug)
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
      });
  }, [params.slug]);

  const onSubmit = async (data: any) => {
    setUploading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);

    try {
      const response = await fetch("/api/reports/" + params.slug, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        navigateLaporan();
      } else {
        toast({
          variant: "destructive",
          title: "Gagal",
          description: "Gagal memperbarui laporan. Silakan coba lagi!",
        });
      }
    } catch (error) {
      console.error("Error updating report:", error);
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Gagal memperbarui laporan. Silakan coba lagi!",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch min-h-screen">
      <NavbarWidget />

      <main className="container mx-auto px-6 py-8 flex-1">
        {report ? (
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
                      Edit
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Edit Laporan
                  </h1>
                  <p className="text-gray-600">
                    Perbarui informasi laporan Anda
                  </p>
                </div>
              </div>
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
                        {...register("title", {
                          required: "Judul laporan wajib diisi",
                          value: report.title,
                        })}
                        className={`w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                          errors.title
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Masukkan judul laporan..."
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

                  {/* Description Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Deskripsi
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        {...register("description", {
                          required: "Deskripsi wajib diisi",
                          value: report.description,
                        })}
                        rows={4}
                        className={`w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none ${
                          errors.description
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-200"
                        }`}
                        placeholder="Masukkan deskripsi laporan..."
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

              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        File Dokumen
                      </h3>
                      <p className="text-sm text-gray-600">
                        File tidak dapat diubah setelah upload
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Terkunci
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="relative border-2 border-dashed border-gray-200 rounded-xl">
                    <embed
                      src={report.file}
                      type="application/pdf"
                      className="w-full h-96 rounded-lg"
                    />

                    {/* Overlay untuk menunjukkan file terkunci */}
                    <div className="absolute inset-0 bg-black bg-opacity-5 rounded-lg pointer-events-none flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-white rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 font-medium">
                          File Terkunci
                        </span>
                      </div>
                    </div>
                  </div>

                  {errors.file && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
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
                      Menyimpan...
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-screen">
            <Circles
              height="40"
              width="40"
              color="#059669"
              ariaLabel="circles-loading"
              visible={true}
            />
          </div>
        )}
        <Toaster />
      </main>
    </div>
  );
}
