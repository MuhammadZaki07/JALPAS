"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Pagination } from "flowbite-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useRef, useState } from "react";
import AuthenticatedOnly from "../components/middleware/authenticated_only";
import NavbarWidget from "../components/navbar";
import { Circles } from "react-loader-spinner";

export default function LaporanList() {
  const [reports, setReports] = useState<any[]>([]);
  const currentReport = useRef<any>(null);
  const { data, status } = useSession();
  const [loading, setLoading] = useState(false);

  const totalPages = useRef(0);
  const totalItems = useRef(0);
  const allItems = useRef([]);
  const page = useRef(1);
  const pageSize = 5;
  const search = useRef("");
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const paginate = (items: any) => {
    const startIndex = (page.current - 1) * pageSize;
    setReports(items.slice(startIndex, startIndex + pageSize));
    totalPages.current = Math.ceil(items.length / pageSize);
    totalItems.current = items.length;
  };

  const handleInputChange = (e: any) => {
    page.current = 1;

    let items = allItems.current;
    search.current = e.target.value;

    if (e.target.value === "") {
      paginate(items);
      return;
    }

    setTimeout(() => {
      items = items.filter((item: any) =>
        item.title.toLowerCase().includes(e.target.value.toLowerCase())
      );
      paginate(items);
    }, 1000);
  };

  const handlePageChange = (newPage: number) => {
    page.current = newPage;
    let items = allItems.current;

    if (search.current != "") {
      items = items.filter((item: any) =>
        item.title.toLowerCase().includes(search.current.toLowerCase())
      );
    }

    paginate(items);
  };

  async function confirmDelete() {
    await fetch(`/api/reports/${currentReport.current.slug}`, {
      method: "DELETE",
    }).then(() => {
      setReports(reports.filter((r) => r.slug !== currentReport.current.slug));
    });

    closeModal();

    // window.location.reload();
  }

  useEffect(() => {
    setLoading(true);
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        // setReports(data);
        paginate(data);
        allItems.current = data;
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-stretch min-h-screen">
      <NavbarWidget />

      <main className="container mx-auto px-6 py-8 flex-1">
        <div className="max-w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan</h1>
            <p className="text-gray-600">
              Kelola dan pantau laporan dengan mudah
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  id="username"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500"
                  onChange={handleInputChange}
                  placeholder="Cari laporan..."
                />
              </div>

              <AuthenticatedOnly>
                <a
                  href="/laporan/upload"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-200"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Unggah Laporan
                </a>
              </AuthenticatedOnly>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="flex justify-center">
                <Circles
                  height="40"
                  width="40"
                  color="#059669"
                  ariaLabel="circles-loading"
                  visible={true}
                />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Publikasi
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Oleh
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Judul
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Deskripsi
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {reports.map((report, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              <span className="text-sm font-medium text-gray-900">
                                {moment(report.createdAt).format("DD MMM YYYY")}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {moment(report.createdAt).format("HH:mm")}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                                {(report?.user?.name ?? "?")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <span className="text-sm text-gray-900 font-medium">
                                {report?.user?.name ?? "-"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              {report.title}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm text-gray-600 line-clamp-2">
                              {report.description}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <a
                                href={`/laporan/${report.slug}`}
                                className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                Detail
                              </a>

                              <AuthenticatedOnly>
                                {report.createdBy ===
                                  (data?.user as any)?.id && (
                                  <>
                                    <a
                                      href={`/laporan/${report.slug}/edit`}
                                      className="inline-flex items-center px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                                    >
                                      <svg
                                        className="w-4 h-4 mr-1"
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
                                      Edit
                                    </a>

                                    <button
                                      className="inline-flex items-center px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
                                      onClick={() => {
                                        openModal();
                                        currentReport.current = report;
                                      }}
                                    >
                                      <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                      Hapus
                                    </button>
                                  </>
                                )}
                              </AuthenticatedOnly>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 px-6 py-1.5 border-t border-gray-200">
                  <div className="flex justify-end">
                    <Pagination
                      currentPage={page.current}
                      totalPages={totalPages.current}
                      onPageChange={handlePageChange}
                      showIcons
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold text-gray-900"
                    >
                      Hapus Laporan?
                    </Dialog.Title>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-600 leading-relaxed">
                      Apakah Anda yakin ingin menghapus laporan ini? Tindakan
                      ini tidak dapat dibatalkan.
                    </p>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      onClick={closeModal}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                      onClick={confirmDelete}
                    >
                      Hapus Laporan
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
