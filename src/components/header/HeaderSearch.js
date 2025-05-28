"use client";

import dynamic from "next/dynamic";

const HeaderSearchIcon = dynamic(() => import("./HeaderSearchIcon"), {
  ssr: false,
});

export default function HeaderSearch({
  query,
  setQuery,
  handleSearch,
  loading,
}) {
  return (
    <form
      onSubmit={handleSearch}
      className="justify-self-end w-full flex gap-2 items-center justify-center"
    >
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-4 py-2 border border-background rounded-lg focus:outline-sgr focus:ring focus:border-black h-[3.5rem] text-background text-2xl"
      />
      <button
        type="submit"
        className="flex items-center justify-center hover:cursor-pointer"
      >
        {loading ? (
          <span className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></span>
        ) : (
          <HeaderSearchIcon />
        )}
      </button>
    </form>
  );
}
