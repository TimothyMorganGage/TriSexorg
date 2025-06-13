export function MedicineWheelLogo({ size = 120 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      className="transform hover:rotate-12 transition-transform duration-500"
    >
      {/* Medicine Wheel Circle */}
      <circle 
        cx="100" 
        cy="100" 
        r="95" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="4"
        className="text-foreground"
      />
      
      {/* Four Directions - Sacred Cross */}
      <line x1="100" y1="5" x2="100" y2="195" stroke="currentColor" strokeWidth="3" className="text-foreground" />
      <line x1="5" y1="100" x2="195" y2="100" stroke="currentColor" strokeWidth="3" className="text-foreground" />
      
      {/* Progress Pride Flag Colors in Medicine Wheel Segments */}
      
      {/* Light Blue (Trans) - East */}
      <path 
        d="M 100 100 L 100 5 A 95 95 0 0 1 167 33 Z" 
        fill="#5BCEFA"
        opacity="0.9"
      />
      
      {/* Pink (Trans) - Northeast */}
      <path 
        d="M 100 100 L 167 33 A 95 95 0 0 1 195 100 Z" 
        fill="#F5A9B8"
        opacity="0.9"
      />
      
      {/* White (Trans/Intersex) - South */}
      <path 
        d="M 100 100 L 195 100 A 95 95 0 0 1 167 167 Z" 
        fill="#FFFFFF"
        opacity="0.9"
      />
      
      {/* Brown (BIPOC) - Southeast */}
      <path 
        d="M 100 100 L 167 167 A 95 95 0 0 1 100 195 Z" 
        fill="#613915"
        opacity="0.9"
      />
      
      {/* Black (BIPOC) - West */}
      <path 
        d="M 100 100 L 100 195 A 95 95 0 0 1 33 167 Z" 
        fill="#000000"
        opacity="0.9"
      />
      
      {/* Red (Traditional Pride) - Southwest */}
      <path 
        d="M 100 100 L 33 167 A 95 95 0 0 1 5 100 Z" 
        fill="#E40303"
        opacity="0.9"
      />
      
      {/* Orange (Traditional Pride) - North */}
      <path 
        d="M 100 100 L 5 100 A 95 95 0 0 1 33 33 Z" 
        fill="#FF8C00"
        opacity="0.9"
      />
      
      {/* Yellow (Traditional Pride) - Northwest */}
      <path 
        d="M 100 100 L 33 33 A 95 95 0 0 1 100 5 Z" 
        fill="#FFED00"
        opacity="0.9"
      />
      
      {/* Inner Medicine Wheel - Sacred Center */}
      <circle 
        cx="100" 
        cy="100" 
        r="25" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3"
        className="text-foreground"
      />
      
      {/* Four Sacred Colors in Center */}
      <circle cx="100" cy="85" r="6" fill="#FFED00" /> {/* Yellow - East */}
      <circle cx="115" cy="100" r="6" fill="#E40303" /> {/* Red - South */}
      <circle cx="100" cy="115" r="6" fill="#000000" /> {/* Black - West */}
      <circle cx="85" cy="100" r="6" fill="#FFFFFF" stroke="#000" strokeWidth="1" /> {/* White - North */}
      
      {/* Center Point - Unity */}
      <circle 
        cx="100" 
        cy="100" 
        r="4" 
        fill="currentColor"
        className="text-primary"
      />
      
      {/* fluck text integrated into design */}
      <text 
        x="100" 
        y="140" 
        textAnchor="middle" 
        className="fill-current text-foreground font-bold text-sm"
        fontSize="14"
      >
        fluck
      </text>
      
      {/* Sacred directions markers */}
      <text x="100" y="20" textAnchor="middle" className="fill-current text-foreground text-xs" fontSize="10">∧</text>
      <text x="180" y="105" textAnchor="middle" className="fill-current text-foreground text-xs" fontSize="10">→</text>
      <text x="100" y="185" textAnchor="middle" className="fill-current text-foreground text-xs" fontSize="10">∨</text>
      <text x="25" y="105" textAnchor="middle" className="fill-current text-foreground text-xs" fontSize="10">←</text>
    </svg>
  );
}