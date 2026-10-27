# SO-101 / ACT lab note — October 2026

The two source recordings are preserved locally in `originals/`, which is ignored by Git. Public videos are silent, at the original speed, with the original framing and colors. No action frames are reordered or spliced.

| Web asset | Local original | Original filename | Retained interval |
| --- | --- | --- | --- |
| `pick-and-place.mp4` | `originals/shoulder-elbow-5deg.mp4` | `acb61f0d01a510885e0ae70f271a663c.mp4` | 0.8–14.2 s |
| `earlier-run.mp4` | `originals/shoulder-elbow-2deg.mp4` | `f88a18f16ca5fc99acb9e05bd87dadfc.mp4` | 9.4 s–end |

The homepage teaser (`teaser.mp4`, `teaser.jpg`) is derived from `pick-and-place.mp4`: the same 13.4 s at 1×, cropped to 1056×594 at (24, 40) to trim the leader arm and empty edges, scaled to 640×360, H.264 CRF 25, silent, fast start. Its poster is the 9.0 s frame with the same crop.

Posters are unaltered frames from the respective originals at 9.8 s and 22.8 s. Web videos use H.264, 1280×720, 30 fps, CRF 21, and MP4 fast start.

Both recordings use the same trained ACT policy and data. The shorter original is the later run, with shoulder and elbow target offsets (relative to current angles) increased from 2° to 5°. Other arm joints retain the 2° limit. The note records an initial experiment, not a success-rate evaluation.

The homepage teaser lives in `index.html`; the full record and deployment details live in `notes/so101-act.html`. Keep future lab notes separate from publications; multiple runs of the same experiment belong in one note.
