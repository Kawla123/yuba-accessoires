import Image from "next/image";

export function AuthSplitShell({
  photoSrc,
  children,
}: {
  photoSrc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[80vh] flex-col md:flex-row-reverse">
      <div className="relative h-[30vh] w-full flex-none md:h-auto md:w-1/2">
        <Image
          src={photoSrc}
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent md:bg-gradient-to-l md:from-ink/30" />
      </div>

      <div className="flex w-full flex-1 flex-col justify-center bg-ink px-6 py-12 sm:px-10 md:w-1/2 md:px-16 lg:px-20">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
