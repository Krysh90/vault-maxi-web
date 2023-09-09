export function TableRow({
  entry,
  index,
  labels,
  percentages,
  colors,
  isLast,
  showPercentage,
}: {
  entry: string
  index: number
  labels: string[]
  percentages: string[]
  colors: string[]
  isLast: boolean
  showPercentage: boolean
}): JSX.Element {
  return (
    <div className="table-row">
      <div
        className={'table-cell text-left py-1'
          .concat(isLast ? '' : ' border-b border-b-light')
          .concat(index > 0 ? ' border-r border-r-light' : '')}
      >
        <div className="flex flex-row items-center gap-1">
          {index !== 0 && <div className="w-1 h-4" style={{ backgroundColor: colors[index] }} />}
          {labels[index]}
        </div>
      </div>
      {showPercentage && (
        <div
          className={'table-cell text-center align-middle'
            .concat(isLast ? '' : ' border-b border-b-light')
            .concat(index > 0 ? ' border-r border-r-light' : '')}
        >
          {index > 0 && percentages[index].length > 0 ? `${percentages[index]}%` : ''}
        </div>
      )}
      <div className={'table-cell text-right align-middle'.concat(isLast ? '' : ' border-b border-b-light')}>
        {entry}
      </div>
    </div>
  )
}
