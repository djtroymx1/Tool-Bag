import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function downloadProjectZip(
  files: Record<string, string>,
  projectName: string
) {
  const zip = new JSZip();

  for (const [filename, content] of Object.entries(files)) {
    if (content) {
      zip.file(filename, content);
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${projectName}-config.zip`);
}
