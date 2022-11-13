interface PageHeaderProps {
  pageHeader: string
  children: any
}

export default function PageHeader({ pageHeader, children }: PageHeaderProps) {
  return (
    <>
      <h1 className="text-4xl text-main">{pageHeader}</h1>
      <div className="flex flex-col w-full pt-4 gap-4 items-center">{children}</div>
    </>
  )
}