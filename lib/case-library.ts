export interface LibraryCase {
  id: string;
  title: string;
  modality: string;
  body_region: string;
  difficulty: 1 | 2 | 3; // 1=easy, 2=medium, 3=hard
  category: string;
  description: string;
  imagePath: string; // path in /public/cases/
  teachingPoints: string[];
}

export const CASE_LIBRARY: LibraryCase[] = [
  // Chest X-rays
  {
    id: "chest-pneumonia-1",
    title: "Right Lower Lobe Pneumonia",
    modality: "XR",
    body_region: "Chest",
    difficulty: 1,
    category: "Infection",
    description: "PA chest radiograph of a 45-year-old with fever and cough.",
    imagePath: "/cases/chest-pneumonia-1.png",
    teachingPoints: [
      "Look for consolidation with air bronchograms",
      "Check costophrenic angles for associated effusion",
      "Silhouette sign helps localize the lobe involved",
    ],
  },
  {
    id: "chest-pneumothorax-1",
    title: "Left Tension Pneumothorax",
    modality: "XR",
    body_region: "Chest",
    difficulty: 2,
    category: "Trauma",
    description: "AP chest radiograph of a 28-year-old after motor vehicle accident.",
    imagePath: "/cases/chest-pneumothorax-1.png",
    teachingPoints: [
      "Look for visceral pleural line with absent lung markings beyond it",
      "Tension signs: mediastinal shift, flattened hemidiaphragm",
      "This is a clinical emergency requiring immediate decompression",
    ],
  },
  {
    id: "chest-effusion-1",
    title: "Large Right Pleural Effusion",
    modality: "XR",
    body_region: "Chest",
    difficulty: 1,
    category: "Fluid",
    description: "PA chest radiograph of a 62-year-old with shortness of breath.",
    imagePath: "/cases/chest-effusion-1.png",
    teachingPoints: [
      "Meniscus sign: fluid tracking up the lateral chest wall",
      "Blunting of costophrenic angle is earliest sign",
      "Large effusions can cause mediastinal shift to contralateral side",
    ],
  },
  {
    id: "chest-cardiomegaly-1",
    title: "Cardiomegaly with Pulmonary Edema",
    modality: "XR",
    body_region: "Chest",
    difficulty: 2,
    category: "Cardiac",
    description: "PA chest radiograph of a 70-year-old with congestive heart failure.",
    imagePath: "/cases/chest-cardiomegaly-1.png",
    teachingPoints: [
      "Cardiothoracic ratio > 0.5 indicates cardiomegaly on PA film",
      "Look for cephalization of vessels, Kerley B lines, peribronchial cuffing",
      "Bilateral pleural effusions common in CHF",
    ],
  },
  // MSK X-rays
  {
    id: "msk-colles-1",
    title: "Distal Radius Fracture (Colles)",
    modality: "XR",
    body_region: "Wrist",
    difficulty: 1,
    category: "Fracture",
    description: "PA and lateral wrist radiographs of a 55-year-old after fall on outstretched hand.",
    imagePath: "/cases/msk-colles-1.png",
    teachingPoints: [
      "Colles fracture: dorsal displacement and angulation of distal radius",
      "Check for associated ulnar styloid fracture",
      "Always get two views — fractures can be occult on one projection",
    ],
  },
  {
    id: "msk-ankle-fracture-1",
    title: "Weber B Ankle Fracture",
    modality: "XR",
    body_region: "Ankle",
    difficulty: 2,
    category: "Fracture",
    description: "AP and lateral ankle radiographs of a 32-year-old after inversion injury.",
    imagePath: "/cases/msk-ankle-fracture-1.png",
    teachingPoints: [
      "Weber B: fracture at level of syndesmosis",
      "Check medial clear space for widening (suggests deltoid ligament injury)",
      "Ottawa ankle rules help determine need for imaging",
    ],
  },
  {
    id: "msk-hip-fracture-1",
    title: "Subcapital Hip Fracture",
    modality: "XR",
    body_region: "Hip",
    difficulty: 2,
    category: "Fracture",
    description: "AP pelvis radiograph of an 82-year-old after fall.",
    imagePath: "/cases/msk-hip-fracture-1.png",
    teachingPoints: [
      "Look for disruption of Shenton's line",
      "Subcapital fractures risk avascular necrosis of femoral head",
      "Garden classification determines management",
    ],
  },
  // Abdominal
  {
    id: "abd-obstruction-1",
    title: "Small Bowel Obstruction",
    modality: "XR",
    body_region: "Abdomen",
    difficulty: 2,
    category: "GI",
    description: "Supine abdominal radiograph of a 65-year-old with vomiting and distension.",
    imagePath: "/cases/abd-obstruction-1.png",
    teachingPoints: [
      "Dilated small bowel > 3cm with valvulae conniventes (cross entire lumen)",
      "Look for transition point and decompressed distal bowel",
      "Air-fluid levels best seen on upright or decubitus views",
    ],
  },
  {
    id: "abd-free-air-1",
    title: "Pneumoperitoneum",
    modality: "XR",
    body_region: "Abdomen",
    difficulty: 3,
    category: "Emergency",
    description: "Upright chest radiograph of a 50-year-old with acute abdominal pain.",
    imagePath: "/cases/abd-free-air-1.png",
    teachingPoints: [
      "Free air under diaphragm (best seen on upright CXR)",
      "Rigler sign: both sides of bowel wall visible",
      "Surgical emergency — suggests bowel perforation",
    ],
  },
  // Head CT
  {
    id: "head-stroke-1",
    title: "Acute MCA Territory Infarct",
    modality: "CT",
    body_region: "Head",
    difficulty: 3,
    category: "Vascular",
    description: "Non-contrast CT head of a 68-year-old with sudden left-sided weakness.",
    imagePath: "/cases/head-stroke-1.png",
    teachingPoints: [
      "Early signs: loss of gray-white differentiation, sulcal effacement",
      "Hyperdense MCA sign suggests clot",
      "CT may be normal in first 6 hours — MRI DWI more sensitive early",
    ],
  },
  {
    id: "head-hemorrhage-1",
    title: "Subdural Hematoma",
    modality: "CT",
    body_region: "Head",
    difficulty: 2,
    category: "Trauma",
    description: "Non-contrast CT head of a 75-year-old on anticoagulants after fall.",
    imagePath: "/cases/head-hemorrhage-1.png",
    teachingPoints: [
      "Crescent-shaped extra-axial collection following brain contour",
      "Crosses suture lines (unlike epidural)",
      "Check for midline shift — may need surgical evacuation if > 5mm",
    ],
  },
  {
    id: "head-epidural-1",
    title: "Epidural Hematoma",
    modality: "CT",
    body_region: "Head",
    difficulty: 3,
    category: "Trauma",
    description: "Non-contrast CT head of a 22-year-old after being hit by a ball.",
    imagePath: "/cases/head-epidural-1.png",
    teachingPoints: [
      "Biconvex (lens-shaped) extra-axial collection",
      "Does NOT cross suture lines (limited by dural attachments)",
      "Associated with temporal bone fracture and middle meningeal artery injury",
      "Lucid interval is classic — can deteriorate rapidly",
    ],
  },
];

// Get a deterministic "daily challenge" based on the date
export function getDailyChallenge(): LibraryCase {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % CASE_LIBRARY.length;
  return CASE_LIBRARY[index];
}

// Get a random case
export function getRandomCase(): LibraryCase {
  const index = Math.floor(Math.random() * CASE_LIBRARY.length);
  return CASE_LIBRARY[index];
}

// Get cases filtered by category, modality, or difficulty
export function filterCases(filters: {
  category?: string;
  modality?: string;
  difficulty?: number;
}): LibraryCase[] {
  return CASE_LIBRARY.filter((c) => {
    if (filters.category && c.category !== filters.category) return false;
    if (filters.modality && c.modality !== filters.modality) return false;
    if (filters.difficulty && c.difficulty !== filters.difficulty) return false;
    return true;
  });
}

// Get all unique categories
export function getCategories(): string[] {
  return [...new Set(CASE_LIBRARY.map((c) => c.category))];
}

// Get all unique modalities
export function getModalities(): string[] {
  return [...new Set(CASE_LIBRARY.map((c) => c.modality))];
}
