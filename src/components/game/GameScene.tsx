// (Keep your existing imports and setup)

export function GameScene({ 
  // ... props
}: GameSceneProps) {
  // ... hooks

  return (
    <div 
      ref={sceneRef}
      className={`relative w-full h-full ${cursorClass}`}
    >
      {/* Background - Now safe to use cover because parent is fixed 16:9 */}
      <div 
        className="absolute inset-0 bg-cover bg-center pixelated"
        style={{ backgroundImage: `url(${breakroomBackground})` }}
      />

      {/* ... (The rest of your content: Characters at h-[45%], Hotspots, etc.) ... */}
      {/* Verify character divs are like: className="absolute bottom-[5%] ... h-[45%]" */}
      
      {/* ... */}
    </div>
  );
}
