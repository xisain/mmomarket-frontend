/** Original vector artwork; no third-party game logos or promotional assets. */
export function GameArt({ variant = 0 }: { variant?: number }) {
  const palettes = [
    ["#c6d7bd", "#7d9a85", "#304d42", "#f8dfa3"],
    ["#ead5aa", "#bd926b", "#765343", "#fff1c5"],
    ["#d9d2ef", "#a49ac6", "#544c7a", "#f5edff"],
    ["#d2d9df", "#8f9da8", "#3d4b56", "#f5d9a5"],
  ];
  const [sky, mountain, foreground, light] =
    palettes[variant % palettes.length];
  return (
    <svg
      viewBox="0 0 400 240"
      fill="none"
      aria-hidden="true"
      className="game-art"
      preserveAspectRatio="xMidYMid slice"
    >
      <path fill={sky} d="M0 0h400v240H0z" />
      <circle cx={variant % 2 ? 105 : 300} cy="66" r="39" fill={light} />
      <path
        d="M0 180 85 63l63 95L225 35l113 141 62-53v117H0Z"
        fill={mountain}
      />
      <path d="m225 35-29 72 29-15 26 15Z" fill={light} opacity=".7" />
      <path
        d="M0 215 74 168l63 23 87-53 92 46 84-23v79H0Z"
        fill={foreground}
        opacity=".6"
      />
      {variant === 1 ? (
        <g fill={foreground} stroke={foreground} strokeWidth="3">
          <path d="M115 205v-69h30v-29h24v29h33v69M248 205V96h28v109M241 96l21-38 22 38ZM108 136l22-35 22 35Z" />
          <path d="M202 204v-41l46-31v73" />
          <path d="M261 58V33l35 9-35 10" fill={light} />
        </g>
      ) : variant === 2 ? (
        <g fill={foreground}>
          <path d="m196 38 25 81-12 86h-27l-12-86ZM251 93l19 52-17 57h-17l-8-57ZM143 102l13 46-12 49h-13l-13-49Z" />
          <path d="m196 38 2 165h-16l-12-84Z" fill={light} opacity=".4" />
          <path d="M80 204h241l-25 36H65Z" />
        </g>
      ) : variant === 3 ? (
        <g fill={foreground}>
          <path d="M164 209v-63l28-12V75l15-29 15 29v59l30 12v63ZM119 211V161l20-11 20 11v50M257 211v-64l20-21 20 21v64" />
          <path d="M194 105h26v8h-26zM198 84h17v8h-17z" fill={light} />
        </g>
      ) : (
        <g fill={foreground}>
          <path d="M133 210v-83h31v-23h25v23h34v-23h25v106ZM124 127l25-48 24 48ZM213 127l24-48 25 48Z" />
          <path d="M175 210v-41a16 16 0 0 1 32 0v41" fill={light} />
          <path
            d="M148 81V51l34 10-34 10M237 81V44l31 10-31 10"
            stroke={foreground}
            strokeWidth="4"
          />
        </g>
      )}
      <path d="M0 225c71-22 110 7 169-3s130-17 231 3v15H0Z" fill={foreground} />
      <g stroke={light} strokeWidth="2" opacity=".7">
        <path d="M52 48v14m-7-7h14M344 92v12m-6-6h12M324 28v8m-4-4h8" />
      </g>
    </svg>
  );
}
export function LootArt() {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      aria-hidden="true"
      className="loot-art"
    >
      <path
        d="m150 18 26 47 53-12-9 55 48 28-43 34 16 53-56-3-22 51-35-43-53 17 2-56-51-24 45-34-15-52 55 4Z"
        fill="#FACC15"
        stroke="#171717"
        strokeWidth="3"
      />
      <g
        transform="rotate(34 150 150)"
        stroke="#171717"
        strokeWidth="4"
        strokeLinejoin="round"
      >
        <path d="m150 42 25 38v107h-50V80Z" fill="#fffdf6" />
        <path d="m150 42 25 38v107h-25Z" fill="#C4B5FD" />
        <path d="M106 178h88l9 17-39 9h-28l-39-9Z" fill="#facc15" />
        <path d="M140 204h20v40h-20Z" fill="#a6c6a2" />
        <path d="M136 213h28m-28 13h28m-28 13h28" />
        <path d="m150 242 15 12-15 14-15-14Z" fill="#C4B5FD" />
      </g>
      <path
        d="M240 45v26m-13-13h26M60 220v20m-10-10h20M51 76l4 9 10 2-8 7 1 10-9-5-9 4 2-10-7-7 10-1Z"
        fill="#fffdf6"
        stroke="#171717"
        strokeWidth="3"
      />
    </svg>
  );
}
