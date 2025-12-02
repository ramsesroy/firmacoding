interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  thumbnailQuality?: "default" | "mqdefault" | "hqdefault" | "sddefault" | "maxresdefault";
}

export default function YouTubeEmbed({ 
  videoId, 
  title, 
  thumbnailQuality = "maxresdefault" 
}: YouTubeEmbedProps) {
  return (
    <div className="my-8 rounded-xl overflow-hidden shadow-2xl bg-black">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
      <div className="p-4 bg-gray-900">
        <p className="text-sm text-gray-400 text-center">
          Watch on YouTube: {title}
        </p>
      </div>
    </div>
  );
}

