interface FooterStudioProps {
  totalTracks: number;
}

function FooterStudio({ totalTracks }: FooterStudioProps) {
  return (
    <div
      className="mt-4 pt-3 border-top d-flex justify-content-between"
      style={{ borderColor: "#4e342e" }}
    >
      <small className="text-muted">v1.1 Powered by Java Streams & React</small>
    </div>
  );
}

export default FooterStudio;
