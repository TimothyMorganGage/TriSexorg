export function MedicineWheelLogo({ 
  size = 120, 
  showPride = true 
}: { 
  size?: number; 
  showPride?: boolean;
}) {
  const prideColors = showPride ? {
    // Progress Pride Flag colors from the provided artwork
    red: "#E40303",
    orange: "#FF8C00", 
    yellow: "#FFED00",
    green: "#008018",
    blue: "#0066FF",
    purple: "#732982",
    transBlue: "#5BCEFA",
    transPink: "#F5A9B8",
    brown: "#613915",
    black: "#000000",
    white: "#FFFFFF"
  } : {
    // Neutral earth tones for non-pride version
    red: "#8B4513",
    orange: "#CD853F", 
    yellow: "#F4A460",
    green: "#6B8E23",
    blue: "#4682B4",
    purple: "#9370DB",
    transBlue: "#87CEEB",
    transPink: "#F5DEB3",
    brown: "#8B4513",
    black: "#2F4F4F",
    white: "#F5F5F5"
  };

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
      
      {/* Intersex Circle (if pride version) */}
      {showPride && (
        <circle 
          cx="100" 
          cy="60" 
          r="8" 
          fill="none" 
          stroke="#7902AA" 
          strokeWidth="2"
        />
      )}
      
      {/* Light Blue (Trans) - East */}
      <path 
        d="M 100 100 L 100 5 A 95 95 0 0 1 167 33 Z" 
        fill={prideColors.transBlue}
        opacity="0.9"
      />
      
      {/* Pink (Trans) - Northeast */}
      <path 
        d="M 100 100 L 167 33 A 95 95 0 0 1 195 100 Z" 
        fill={prideColors.transPink}
        opacity="0.9"
      />
      
      {/* White (Trans/Intersex) - East-Southeast */}
      <path 
        d="M 100 100 L 195 100 A 95 95 0 0 1 167 167 Z" 
        fill={prideColors.white}
        opacity="0.9"
      />
      
      {/* Brown (BIPOC) - Southeast */}
      <path 
        d="M 100 100 L 167 167 A 95 95 0 0 1 100 195 Z" 
        fill={prideColors.brown}
        opacity="0.9"
      />
      
      {/* Black (BIPOC) - South */}
      <path 
        d="M 100 100 L 100 195 A 95 95 0 0 1 33 167 Z" 
        fill={prideColors.black}
        opacity="0.9"
      />
      
      {/* Purple (Traditional Pride) - Southwest */}
      <path 
        d="M 100 100 L 33 167 A 95 95 0 0 1 5 100 Z" 
        fill={prideColors.purple}
        opacity="0.9"
      />
      
      {/* Blue (Traditional Pride) - West */}
      <path 
        d="M 100 100 L 5 100 A 95 95 0 0 1 33 33 Z" 
        fill={prideColors.blue}
        opacity="0.9"
      />
      
      {/* Green (Traditional Pride) - Northwest */}
      <path 
        d="M 100 100 L 33 33 A 95 95 0 0 1 100 5 Z" 
        fill={prideColors.green}
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
      <circle cx="100" cy="85" r="6" fill={prideColors.yellow} /> {/* Yellow - East */}
      <circle cx="115" cy="100" r="6" fill={prideColors.red} /> {/* Red - South */}
      <circle cx="100" cy="115" r="6" fill={prideColors.black} /> {/* Black - West */}
      <circle cx="85" cy="100" r="6" fill={prideColors.white} stroke="#000" strokeWidth="1" /> {/* White - North */}
      
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
        fontFamily="Cinzel, serif"
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