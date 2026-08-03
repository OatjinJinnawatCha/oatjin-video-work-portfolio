

interface Props {
  categories: string[];
  active: string;
  onSelect: (cat: string) => void;
}

export default function CategoryPills({ categories, active, onSelect }: Props) {
  return (
    <div className="pills-container">
      {categories.map(cat => (
        <button
          key={cat}
          className={`pill ${active === cat ? 'active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
      {/* <button className="pill view-more">
        View More &rarr;
      </button> */}
    </div>
  );
}
