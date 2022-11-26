import Card, { CardItem } from './card'

export interface CardOverviewProps {
  items: CardItem[]
}

export default function CardOverview<T>({ items }: CardOverviewProps): JSX.Element {
  return (
    <div className="flex flex-col items-center pt-4 gap-4 lg:flex-row lg:flex-wrap lg:justify-center lg:items-start">
      {items.map((item, index) => (
        <Card key={index} item={item} />
      ))}
    </div>
  )
}
