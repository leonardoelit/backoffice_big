import React, { startTransition, useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/utils/toastUtil";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Utility: Sorting function
const sortData = (data: any[], column: string, direction: "asc" | "desc") => {
  return [...data].sort((a, b) => {
    const aValue = a[column];
    const bValue = b[column];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });
};

export default function BasicTableUser() {
  const { allUsersList, getAllUsersAdmin, changeUserCredentialsAdmin, logoutAdmin } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [openPopover, setOpenPopover] = useState<{ userId: number | null; field: 'pct' | 'btag' | 'password' | null }>({ userId: null, field: null });
  const [pctValues, setPctValues] = useState<Record<number, number>>({});
  const [btagValues, setBtagValues] = useState<Record<string, string>>({});
  const [newPassword, setNewPassword] = useState('')
  const [isButtonPressed, setisButtonPressed] = useState(false);
  const [isChangingPct, setIsChangingPct] = useState(false);
  const [isChangingBtag, setIsChangingBtag] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [changingUsername, setChangingUsername] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" | null }>({ key: "", direction: null });
  const router = useRouter()

  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getAllUsersAdmin();
  }, []);

  useEffect(() => {
    if (allUsersList && allUsersList.length > 0) {
      startTransition(() => {
        setIsLoading(false);
        setIsChangingPct(false);
        setIsChangingBtag(false);
      });
    }
  }, [allUsersList]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpenPopover({ userId: null, field: null });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: "", direction: null };
      }
      return { key, direction: "asc" };
    });
  };

  function formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
  }

  const sortedUsers = sortConfig.key && sortConfig.direction
    ? sortData(allUsersList, sortConfig.key, sortConfig.direction)
    : allUsersList;

  const totalPages = Math.ceil((sortedUsers?.length || 0) / rowsPerPage);

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const SkeletonRow = ({ columns }: { columns: number }) => (
    <TableRow>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index} className="px-5 py-4">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </TableCell>
      ))}
    </TableRow>
  );

  const handlePctChange = (username: string, pct: string | number) => {
    setChangingUsername(username);
    setIsChangingPct(true);
    changeUserCredentialsAdmin(username, null, Number(pct), null, null);
    getAllUsersAdmin();
  };

  const handleBtagChange = (username: string, btag: string) => {
    setChangingUsername(username);
    setIsChangingBtag(true);
    changeUserCredentialsAdmin(username, btag, null, null, null);
    getAllUsersAdmin();
  };

  const handlePasswordChange = async (username: string, password: string) => {
    const token = localStorage.getItem('authToken');
    if(token){
      try {
        const res = await changeUserCredentials(token, username, null, null, password, null);
        if (res.isSuccess) setNewPassword('');
        showToast(res.message, res.isSuccess ? 'info' : 'error')
      } catch (error) {
        console.log(error);
        showToast("Sunucu hatası, lütfen daha sonra tekrar deneyiniz!", 'error')
      }
    }
  };

  const handleDeleteUser = async (username: string) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setisButtonPressed(true);
      const response = await deleteUser(token, username);
      if (response.isSuccess) getAllUsersAdmin();
      showToast(response.message, response.isSuccess ? 'info' : 'error')
      setisButtonPressed(false);
    }
  };

  //const handleLoginAsUser = async (username: string, role:string) => {
  //  if(role === "admin"){
  //    showToast(`Admin hesaplarına giriş yapamazsınız!`, 'error')
  //  }
  //  const token = localStorage.getItem('authToken');
  //  if (token) {
  //    setisButtonPressed(true);
  //    const response = await loginAsUser(token, username);
  //    if (response.isSuccess) {
  //      showToast(`Kullanıcı ${username} olarak giriş yapılıyor. Lütfen bekleyiniz...`, 'info')
  //      logoutAdmin(response);
  //      router.push('/')
  //    }else{
  //      showToast('Seçilen kullanıcı olarak giriş başarısız oldu!', 'error')
  //    }
  //    setisButtonPressed(false);
  //  }
  //};

  const getSortArrow = (key: string) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : sortConfig.direction === "desc" ? "▼" : "";
    }
    return "";
  };
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-white/[0.02]">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {paginatedUsers.length} of {allUsersList && allUsersList.length} users
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="rowsPerPage" className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</label>
          <select
            id="rowsPerPage"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="text-sm rounded-md border border-gray-300 px-2 py-1 dark:bg-gray-700 dark:text-white"
          >
            {[25, 50, 75, 100].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[1102px] min-h-[600px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("id")}>ID {getSortArrow("id")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Kullanıcı adı</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">İsim</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">BTag</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("role")}>Rol {getSortArrow("role")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("balance")}>Bakiye {getSortArrow("balance")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("pct")}>Oran {getSortArrow("pct")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" onClick={() => handleSort("createdAt")}>Tarih {getSortArrow("createdAt")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer" >Onay</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer">
                    İşlemler
                </TableCell>

              </TableRow>
            </TableHeader>

            <TableBody className={`divide-y divide-gray-100 dark:divide-white/[0.05] transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
              {isLoading ? (
                <>
                  {Array.from({ length: rowsPerPage }).map((_, i) => (
                    <SkeletonRow key={i} columns={11} />
                  ))}
                </>
              ) : (paginatedUsers.map((user) => {
                if(!user.approved) return;
                return (
                  <TableRow key={user.id}>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      <Link href={`/admin/users/${user.username}`} className="hover:text-blue-800 dark:hover:text-blue-800 transition-colors">
                        {user.id}
                      </Link>
                    </TableCell>
                     <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      <Link href={`/admin/users/${user.username}`} className="hover:text-blue-800 dark:hover:text-blue-800 transition-colors">
                        {user.username}
                      </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{`${user.fullname} ${user.lastname}`}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{user.email}</TableCell>
                    {isChangingBtag && changingUsername === user.username ? (
                      <TableCell className="px-5 py-4">
                            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        </TableCell>
                    ): (
                    <TableCell className="relative px-4 py-3 text-blue-900 text-start text-theme-sm dark:text-gray-400">
                        <span
                            onClick={() => {
                            setOpenPopover({ userId: user.id, field: 'btag' });
                            setBtagValues((prev) => ({ ...prev, [user.id]: user.btag }));
                            }}
                            className="cursor-pointer hover:underline"
                        >
                            {user.btag}
                        </span>

                        {openPopover.userId === user.id && openPopover.field === 'btag' && (
                            <div
                            ref={popoverRef}
                            className="absolute z-50 bg-white dark:bg-gray-800 shadow-lg border rounded-xl p-3 top-full left-1/2 -translate-x-1/2 mt-2 w-40"
                            >
                            <input
                                type="text"
                                value={btagValues[user.id] ?? ''}
                                onChange={(e) =>
                                setBtagValues((prev) => ({
                                    ...prev,
                                    [user.id]: e.target.value,
                                }))
                                }
                                className="w-full text-sm px-2 py-1 border rounded-md mb-2 dark:bg-gray-700 dark:text-white"
                            />
                            <button
                                onClick={() => {
                                handleBtagChange(user.username, btagValues[user.id]);
                                setOpenPopover({ userId: null, field: null });
                                }}
                                className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1 rounded-md"
                            >
                                Apply
                            </button>
                            </div>
                        )}
                    </TableCell>
                    )}
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{user.role}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{user.balance}</TableCell>
                      {isChangingPct && changingUsername === user.username ? (
                        <TableCell className="px-5 py-4">
                            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        </TableCell>
                      ) : (
                    <TableCell className="relative px-4 py-3 text-blue-900 text-start text-theme-sm dark:text-gray-400">
                        <span
                            onClick={() => {
                            setOpenPopover({ userId: user.id, field: 'pct' });
                            setPctValues((prev) => ({ ...prev, [user.id]: user.pct }));
                            }}
                            className="cursor-pointer hover:underline"
                        >
                            {user.pct}%
                        </span>

                        {openPopover.userId === user.id && openPopover.field === 'pct' && (
                            <div
                            ref={popoverRef}
                            className="absolute z-50 bg-white dark:bg-gray-800 shadow-lg border rounded-xl p-3 top-full left-1/2 -translate-x-1/2 mt-2 w-40"
                            >
                            <input
                                type="number"
                                value={pctValues[user.id] ?? ''}
                                onChange={(e) =>
                                setPctValues((prev) => ({
                                    ...prev,
                                    [user.id]: Number(e.target.value),
                                }))
                                }
                                className="w-full text-sm px-2 py-1 border rounded-md mb-2 dark:bg-gray-700 dark:text-white"
                                min={0}
                                max={100}
                            />
                            <button
                                onClick={() => {
                                    handlePctChange(user.username, pctValues[user.id])
                                    setOpenPopover({ userId: null, field: null });
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded-md"
                            >
                                Apply
                            </button>
                            </div>
                        )}
                    </TableCell>
                      )}
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">{formatDateToDDMMYYYY(user.createdAt)}</TableCell>
                    <TableCell className="relative px-4 py-3 text-blue-900 text-start text-theme-sm dark:text-gray-400">{user.approved ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-check-icon lucide-badge-check w-6 h-6 fill-green-600 text-white"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-dashed-icon lucide-circle-dashed"><path d="M10.1 2.182a10 10 0 0 1 3.8 0"/><path d="M13.9 21.818a10 10 0 0 1-3.8 0"/><path d="M17.609 3.721a10 10 0 0 1 2.69 2.7"/><path d="M2.182 13.9a10 10 0 0 1 0-3.8"/><path d="M20.279 17.609a10 10 0 0 1-2.7 2.69"/><path d="M21.818 10.1a10 10 0 0 1 0 3.8"/><path d="M3.721 6.391a10 10 0 0 1 2.7-2.69"/><path d="M6.391 20.279a10 10 0 0 1-2.69-2.7"/></svg>
                    )}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 text-start text-theme-sm dark:text-gray-400">
                      <div className="relative flex items-center space-x-2">
                        {user.role === 'user' && (
                          <>
                          <button
      //                      onClick={() => handleLoginAsUser(user.username, user.role)}
                            title="Kullanıcı olarak giriş yap"
                            className="inline-flex items-center justify-center hover:text-blue-600"
                            disabled={isButtonPressed}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-blue-600 hover:fill-blue-800" viewBox="0 0 24 24">
                              <path d="M10 17l5-5-5-5v10zm9-13H5c-1.1 0-2 .9-2 2v4h2V6h14v12H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setOpenPopover({ userId: user.id, field: 'password' });
                            }}
                            title="Kullanıcının şifresini değiştir"
                            className="inline-flex items-center justify-center hover:text-red-600"
                            disabled={isButtonPressed}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 52 52"
                              className="w-[17px] h-[17px] pb-[2px] fill-gray-700 hover:fill-gray-900"
                            >
                              <g>
                                <path d="M42,23H10c-2.2,0-4,1.8-4,4v19c0,2.2,1.8,4,4,4h32c2.2,0,4-1.8,4-4V27C46,24.8,44.2,23,42,23z M31,44.5 c-1.5,1-3.2,1.5-5,1.5c-0.6,0-1.2-0.1-1.8-0.2c-2.4-0.5-4.4-1.8-5.7-3.8l3.3-2.2c0.7,1.1,1.9,1.9,3.2,2.1c1.3,0.3,2.6,0,3.8-0.8 c2.3-1.5,2.9-4.7,1.4-6.9c-0.7-1.1-1.9-1.9-3.2-2.1c-1.3-0.3-2.6,0-3.8,0.8c-0.3,0.2-0.5,0.4-0.7,0.6L26,37h-9v-9l2.6,2.6 c0.4-0.4,0.9-0.8,1.3-1.1c2-1.3,4.4-1.8,6.8-1.4c2.4,0.5,4.4,1.8,5.7,3.8C36.2,36.1,35.1,41.7,31,44.5z"></path>
                                <path d="M10,18.1v0.4C10,18.4,10,18.3,10,18.1C10,18.1,10,18.1,10,18.1z"></path>
                                <path d="M11,19h4c0.6,0,1-0.3,1-0.9V18c0-5.7,4.9-10.4,10.7-10C32,8.4,36,13,36,18.4v-0.3c0,0.6,0.4,0.9,1,0.9h4 c0.6,0,1-0.3,1-0.9V18c0-9.1-7.6-16.4-16.8-16c-8.5,0.4-15,7.6-15.2,16.1C10.1,18.6,10.5,19,11,19z"></path>
                              </g>
                            </svg>
                          </button>
                          </>
                        )}

                        {openPopover.userId === user.id && openPopover.field === 'password' && (
                            <div
                            ref={popoverRef}
                            className="absolute z-50 bg-white dark:bg-gray-800 shadow-lg border rounded-xl p-3 top-full left-6/7 -translate-x-6/7 mt-2 w-40"
                            >
                            <input
                                type="text"
                                value={newPassword}
                                onChange={(e) =>
                                setNewPassword(() => (
                                    String(e.target.value)
                                ))
                                }
                                className="w-full text-sm px-2 py-1 border rounded-md mb-2 dark:bg-gray-700 dark:text-white"
                                min={0}
                                max={100}
                            />
                            <button
                                onClick={() => {
                                    handlePasswordChange(user.username, newPassword)
                                    setOpenPopover({ userId: null, field: null });
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 rounded-md"
                            >
                                Apply
                            </button>
                            </div>
                        )}

                        <button
                          onClick={() => {
                            setUserToDelete(user.username);
                            setShowDeleteModal(true);
                          }}
                          title="Kullanıcıyı sil"
                          className="inline-flex items-center justify-center hover:text-red-600"
                          disabled={isButtonPressed}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-red-600 hover:fill-red-800" viewBox="0 0 24 24">
                            <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"/>
                          </svg>
                        </button>
                      </div>
                    </TableCell>

                  </TableRow>
                );
              }))}
            </TableBody>
          </Table>
          {showDeleteModal && userToDelete && (
            <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black/50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kullanıcı Silmeyi Onayla</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                  <span className="font-medium">{userToDelete}</span> isimli kullanıcıyı silmek istediğinize emin misiniz ? Bu işlem geri alınamaz.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setUserToDelete(null);
                    }}
                    className="px-4 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    disabled={isButtonPressed}
                  >
                    İptal
                  </button>
                  <button
                    onClick={async () => {
                      await handleDeleteUser(userToDelete);
                      setShowDeleteModal(false);
                      setUserToDelete(null);
                    }}
                    className="px-4 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
                    disabled={isButtonPressed}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-4 py-3">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 dark:text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
