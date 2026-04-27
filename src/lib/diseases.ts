/**
 * Disease Knowledge Base — detailed information for all 23 skin conditions.
 * Used by ResultsView to show expandable disease detail cards.
 */

export interface DiseaseInfo {
  id: string;
  displayName: string;
  category: string;
  severity: "low" | "moderate" | "high" | "critical";
  description: string;
  symptoms: string[];
  causes: string[];
  commonLocations: string[];
  whenToSeeDoctor: string;
}

export const DISEASE_DATABASE: Record<string, DiseaseInfo> = {
  Acne_Rosacea: {
    id: "Acne_Rosacea",
    displayName: "Acne & Rosacea",
    category: "Inflammatory",
    severity: "moderate",
    description:
      "A chronic inflammatory skin condition causing redness, pimples, and visible blood vessels, primarily on the face. Often confused with regular acne but requires different treatment approaches.",
    symptoms: [
      "Persistent facial redness",
      "Bumps and pimples",
      "Visible blood vessels (telangiectasia)",
      "Eye irritation or dryness",
      "Burning or stinging sensation",
    ],
    causes: [
      "Genetic predisposition",
      "Environmental triggers (sun, heat, wind)",
      "Certain foods and beverages",
      "Stress and hormonal changes",
    ],
    commonLocations: ["Face", "Nose", "Cheeks", "Forehead", "Chin"],
    whenToSeeDoctor:
      "See a dermatologist if redness persists for more than 2 weeks, or if bumps and pimples do not respond to over-the-counter treatments.",
  },

  Allergic_Contact_Dermatitis: {
    id: "Allergic_Contact_Dermatitis",
    displayName: "Allergic Contact Dermatitis",
    category: "Allergic",
    severity: "moderate",
    description:
      "An itchy, red rash triggered by direct skin contact with an allergen such as nickel, fragrances, or poison ivy. The reaction typically appears 24–72 hours after exposure.",
    symptoms: [
      "Red, itchy rash at contact site",
      "Blisters that may weep or crust",
      "Swelling and tenderness",
      "Dry, cracked, or scaly skin",
      "Burning sensation",
    ],
    causes: [
      "Nickel (jewelry, belt buckles)",
      "Fragrances and preservatives in cosmetics",
      "Poison ivy, oak, or sumac",
      "Latex or rubber products",
    ],
    commonLocations: ["Hands", "Face", "Neck", "Wrists", "Eyelids"],
    whenToSeeDoctor:
      "Seek medical attention if the rash is widespread, painful, on the face or genitals, or does not improve within 2–3 weeks.",
  },

  Athletes_Foot: {
    id: "Athletes_Foot",
    displayName: "Athlete's Foot",
    category: "Fungal",
    severity: "low",
    description:
      "A common fungal infection (tinea pedis) affecting the skin on the feet, especially between the toes. It thrives in warm, moist environments like shoes and locker rooms.",
    symptoms: [
      "Itching and burning between toes",
      "Peeling or flaking skin on soles",
      "Redness and inflammation",
      "Blisters that ooze or crust",
      "Dry, scaly skin on the sides of feet",
    ],
    causes: [
      "Dermatophyte fungi (Trichophyton)",
      "Walking barefoot in public areas",
      "Prolonged sweaty footwear",
      "Sharing towels or shoes",
    ],
    commonLocations: ["Between toes", "Soles of feet", "Sides of feet"],
    whenToSeeDoctor:
      "See a doctor if over-the-counter antifungals don't work after 2 weeks, if the infection spreads, or if you have diabetes.",
  },

  Atopic_Dermatitis_and_Keratosis: {
    id: "Atopic_Dermatitis_and_Keratosis",
    displayName: "Atopic Dermatitis & Keratosis",
    category: "Inflammatory",
    severity: "moderate",
    description:
      "Atopic dermatitis (eczema) is a chronic condition causing itchy, inflamed skin, often associated with keratosis pilaris — small, rough bumps on the skin. Both are linked to genetic and immune factors.",
    symptoms: [
      "Intense itching, especially at night",
      "Red to brownish-gray patches",
      "Small, rough bumps (keratosis pilaris)",
      "Thickened, cracked, or scaly skin",
      "Raw or sensitive skin from scratching",
    ],
    causes: [
      "Genetic factors and family history",
      "Immune system dysfunction",
      "Dry skin and environmental irritants",
      "Allergens (dust mites, pet dander, pollen)",
    ],
    commonLocations: ["Inner elbows", "Behind knees", "Face", "Upper arms", "Thighs"],
    whenToSeeDoctor:
      "Consult a dermatologist if itching disrupts sleep or daily activities, if skin becomes painful or infected, or if home treatments are ineffective.",
  },

  Bacterial_Skin_Infection: {
    id: "Bacterial_Skin_Infection",
    displayName: "Bacterial Skin Infection",
    category: "Infectious",
    severity: "high",
    description:
      "Skin infections caused by bacteria such as Staphylococcus or Streptococcus. Includes conditions like cellulitis, impetigo, and folliculitis. Can become serious if untreated.",
    symptoms: [
      "Red, swollen, warm area of skin",
      "Pain or tenderness",
      "Pus-filled blisters or boils",
      "Fever or feeling unwell",
      "Spreading redness or red streaks",
    ],
    causes: [
      "Staphylococcus aureus (including MRSA)",
      "Streptococcus bacteria",
      "Breaks in skin (cuts, insect bites)",
      "Weakened immune system",
    ],
    commonLocations: ["Face", "Legs", "Arms", "Around wounds", "Hair follicles"],
    whenToSeeDoctor:
      "Seek immediate medical attention if you develop fever, rapidly spreading redness, red streaks from the wound, or if the infected area becomes very painful.",
  },

  Benign_Skin_Lesion: {
    id: "Benign_Skin_Lesion",
    displayName: "Benign Skin Lesion",
    category: "Neoplastic",
    severity: "low",
    description:
      "Non-cancerous skin growths such as moles, skin tags, dermatofibromas, or cherry angiomas. While generally harmless, any changes in size, shape, or color should be monitored.",
    symptoms: [
      "Stable, well-defined growth",
      "Uniform color (brown, tan, or skin-colored)",
      "Smooth or slightly raised surface",
      "Usually painless",
      "Slow or no growth over time",
    ],
    causes: [
      "Normal skin cell overgrowth",
      "Sun exposure over time",
      "Genetic predisposition",
      "Aging process",
    ],
    commonLocations: ["Face", "Trunk", "Arms", "Legs", "Neck"],
    whenToSeeDoctor:
      "Monitor for changes using the ABCDE rule (Asymmetry, Border, Color, Diameter, Evolving). See a dermatologist if any lesion changes rapidly or bleeds.",
  },

  Bullous_Disease: {
    id: "Bullous_Disease",
    displayName: "Bullous Disease",
    category: "Autoimmune",
    severity: "high",
    description:
      "A group of conditions characterized by large, fluid-filled blisters (bullae) on the skin. Includes bullous pemphigoid and pemphigus vulgaris. Often autoimmune in origin.",
    symptoms: [
      "Large, tense blisters filled with clear fluid",
      "Itching or burning before blisters appear",
      "Red or irritated skin around blisters",
      "Blisters that rupture and form sores",
      "Oral blisters (in pemphigus)",
    ],
    causes: [
      "Autoimmune attack on skin proteins",
      "Certain medications as triggers",
      "Genetic susceptibility",
      "Age (more common in elderly)",
    ],
    commonLocations: ["Trunk", "Arms", "Legs", "Oral mucosa", "Groin"],
    whenToSeeDoctor:
      "See a doctor promptly. Bullous diseases require medical treatment. Seek urgent care if blisters are widespread, painful, or if you have difficulty eating due to mouth sores.",
  },

  Cutaneous_Larva_Migrans: {
    id: "Cutaneous_Larva_Migrans",
    displayName: "Cutaneous Larva Migrans",
    category: "Parasitic",
    severity: "moderate",
    description:
      "A parasitic skin infection caused by hookworm larvae, typically acquired by walking barefoot on contaminated sand or soil. The larvae create characteristic winding, snake-like tracks under the skin.",
    symptoms: [
      "Intensely itchy, raised, winding red tracks",
      "Tracks that advance 1–2 cm per day",
      "Tingling or prickling sensation",
      "Blisters along the track path",
      "Secondary infection from scratching",
    ],
    causes: [
      "Hookworm larvae (Ancylostoma braziliense)",
      "Walking barefoot on contaminated beaches",
      "Contact with animal-contaminated soil",
      "Common in tropical and subtropical regions",
    ],
    commonLocations: ["Feet", "Buttocks", "Hands", "Knees"],
    whenToSeeDoctor:
      "See a doctor for treatment. While self-limiting, the intense itching and risk of secondary infection make medical treatment advisable.",
  },

  Eczema_Others: {
    id: "Eczema_Others",
    displayName: "Eczema (Other Types)",
    category: "Inflammatory",
    severity: "moderate",
    description:
      "Encompasses various forms of eczema beyond atopic dermatitis, including dyshidrotic eczema, nummular eczema, and stasis dermatitis. All cause itchy, inflamed skin with different patterns.",
    symptoms: [
      "Itchy, inflamed skin patches",
      "Small blisters (dyshidrotic type)",
      "Coin-shaped lesions (nummular type)",
      "Dry, cracked, thickened skin",
      "Weeping or crusting in acute phases",
    ],
    causes: [
      "Immune system dysfunction",
      "Skin barrier defects",
      "Environmental irritants and allergens",
      "Stress and weather changes",
    ],
    commonLocations: ["Hands", "Fingers", "Lower legs", "Arms", "Trunk"],
    whenToSeeDoctor:
      "See a dermatologist if eczema interferes with daily life, if skin appears infected (oozing, crusting, warmth), or if over-the-counter treatments are ineffective.",
  },

  HSV_HPV_STD_STI: {
    id: "HSV_HPV_STD_STI",
    displayName: "HSV / HPV / STD-Related Skin Conditions",
    category: "Viral / Sexually Transmitted",
    severity: "high",
    description:
      "Skin manifestations of sexually transmitted infections including herpes simplex virus (HSV), human papillomavirus (HPV), and others. These require medical evaluation and treatment.",
    symptoms: [
      "Painful blisters or sores (HSV)",
      "Flesh-colored bumps or warts (HPV)",
      "Itching or tingling before outbreaks",
      "Ulcers that may recur periodically",
      "Unusual skin growths in genital area",
    ],
    causes: [
      "Herpes simplex virus (HSV-1, HSV-2)",
      "Human papillomavirus (HPV)",
      "Sexual contact transmission",
      "Skin-to-skin contact",
    ],
    commonLocations: ["Genital area", "Mouth and lips", "Perianal region", "Thighs"],
    whenToSeeDoctor:
      "See a healthcare provider promptly for proper diagnosis, testing, and treatment. Early treatment helps manage symptoms and reduce transmission risk.",
  },

  Leprosy: {
    id: "Leprosy",
    displayName: "Leprosy (Hansen's Disease)",
    category: "Infectious",
    severity: "critical",
    description:
      "A chronic bacterial infection caused by Mycobacterium leprae that primarily affects the skin, peripheral nerves, and mucous membranes. Curable with multi-drug therapy if caught early.",
    symptoms: [
      "Light-colored or reddish skin patches",
      "Loss of sensation in affected areas",
      "Numbness or tingling in hands and feet",
      "Thickened skin or nodules",
      "Muscle weakness",
    ],
    causes: [
      "Mycobacterium leprae bacteria",
      "Prolonged close contact with untreated cases",
      "Weakened immune response",
      "Genetic susceptibility",
    ],
    commonLocations: ["Face", "Earlobes", "Arms", "Legs", "Hands and feet"],
    whenToSeeDoctor:
      "Seek medical attention immediately if you notice skin patches with loss of sensation. Early diagnosis and treatment with antibiotics can prevent disability.",
  },

  Lichenoid_Dermatoses: {
    id: "Lichenoid_Dermatoses",
    displayName: "Lichenoid Dermatoses",
    category: "Inflammatory",
    severity: "moderate",
    description:
      "A group of conditions including lichen planus, characterized by flat-topped, purple, polygonal, itchy papules. Can affect skin, nails, hair, and mucous membranes.",
    symptoms: [
      "Flat-topped, shiny, purple-red papules",
      "Intense itching",
      "White lacy pattern on lesions (Wickham's striae)",
      "Nail ridging or thinning",
      "Painful oral lesions (white, lacy patches)",
    ],
    causes: [
      "Immune-mediated reaction",
      "Certain medications (NSAIDs, antimalarials)",
      "Hepatitis C association",
      "Stress may trigger flares",
    ],
    commonLocations: ["Wrists", "Ankles", "Lower back", "Oral mucosa", "Nails"],
    whenToSeeDoctor:
      "See a dermatologist for persistent or spreading lesions. Oral lichen planus requires monitoring as it has a small risk of malignant transformation.",
  },

  Lupus_and_Connective_Tissue_Diseases: {
    id: "Lupus_and_Connective_Tissue_Diseases",
    displayName: "Lupus & Connective Tissue Diseases",
    category: "Autoimmune",
    severity: "critical",
    description:
      "Autoimmune conditions where the body attacks its own tissues. Skin lupus (cutaneous lupus) causes distinctive rashes. Can be part of systemic lupus erythematosus (SLE) affecting multiple organs.",
    symptoms: [
      "Butterfly-shaped rash across cheeks and nose",
      "Disc-shaped, scaly red patches",
      "Photosensitivity (rash worsens with sun)",
      "Joint pain and fatigue",
      "Hair loss and mouth sores",
    ],
    causes: [
      "Autoimmune dysfunction",
      "Genetic predisposition",
      "UV light exposure triggers",
      "Hormonal factors (more common in women)",
    ],
    commonLocations: ["Face (butterfly rash)", "Scalp", "Arms", "Chest", "Ears"],
    whenToSeeDoctor:
      "See a doctor promptly. Lupus requires ongoing medical management. Seek urgent care if you experience chest pain, difficulty breathing, or severe fatigue alongside skin symptoms.",
  },

  Malignant_Skin_Lesion: {
    id: "Malignant_Skin_Lesion",
    displayName: "Malignant Skin Lesion",
    category: "Neoplastic",
    severity: "critical",
    description:
      "Potentially cancerous skin growths including melanoma, basal cell carcinoma, and squamous cell carcinoma. Early detection and treatment are critical for the best outcomes.",
    symptoms: [
      "Asymmetric mole or growth",
      "Irregular or blurred borders",
      "Multiple colors within one lesion",
      "Diameter larger than 6mm (pencil eraser)",
      "Evolving size, shape, or color over time",
    ],
    causes: [
      "UV radiation (sun and tanning beds)",
      "History of severe sunburns",
      "Fair skin with many moles",
      "Family history of skin cancer",
    ],
    commonLocations: ["Face", "Neck", "Arms", "Back", "Legs"],
    whenToSeeDoctor:
      "See a dermatologist IMMEDIATELY. Use the ABCDE rule: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolving. Any suspicious lesion should be biopsied promptly.",
  },

  Nail_Fungus: {
    id: "Nail_Fungus",
    displayName: "Nail Fungus (Onychomycosis)",
    category: "Fungal",
    severity: "low",
    description:
      "A fungal infection of the fingernails or toenails causing discoloration, thickening, and crumbling. Toenails are more commonly affected. Difficult to treat and often recurring.",
    symptoms: [
      "Yellow, brown, or white nail discoloration",
      "Thickened or distorted nail shape",
      "Brittle, crumbly, or ragged nail edges",
      "Separation of nail from the nail bed",
      "Mild odor from affected nail",
    ],
    causes: [
      "Dermatophyte fungi",
      "Warm, moist environments (shoes)",
      "Damaged or weakened nails",
      "Poor circulation (diabetes, aging)",
    ],
    commonLocations: ["Toenails (especially big toe)", "Fingernails"],
    whenToSeeDoctor:
      "See a doctor if nails become painful, if you have diabetes or a weakened immune system, or if self-care hasn't helped after several weeks.",
  },

  "Psoriasis_and_Seborrheic Dermatitis": {
    id: "Psoriasis_and_Seborrheic Dermatitis",
    displayName: "Psoriasis & Seborrheic Dermatitis",
    category: "Inflammatory",
    severity: "moderate",
    description:
      "Chronic inflammatory conditions causing scaly patches. Psoriasis produces thick, silvery scales on red patches, while seborrheic dermatitis causes flaky, yellowish scales, especially on the scalp.",
    symptoms: [
      "Red patches with silvery-white scales (psoriasis)",
      "Flaky, yellowish scales on scalp (seborrheic)",
      "Itching and burning",
      "Dry, cracked skin that may bleed",
      "Stiff or swollen joints (psoriatic arthritis)",
    ],
    causes: [
      "Immune system overactivity",
      "Genetic predisposition",
      "Stress and infections as triggers",
      "Malassezia yeast overgrowth (seborrheic)",
    ],
    commonLocations: ["Scalp", "Elbows", "Knees", "Lower back", "Eyebrows", "Nasolabial folds"],
    whenToSeeDoctor:
      "See a dermatologist if symptoms are widespread, painful, or not controlled with over-the-counter treatments. Joint pain alongside skin symptoms needs evaluation.",
  },

  Scabies_and_Infestation: {
    id: "Scabies_and_Infestation",
    displayName: "Scabies & Skin Infestation",
    category: "Parasitic",
    severity: "moderate",
    description:
      "A highly contagious skin condition caused by the Sarcoptes scabiei mite burrowing into the skin. Causes intense itching, especially at night, and is spread through prolonged skin-to-skin contact.",
    symptoms: [
      "Intense itching, worse at night",
      "Thin, irregular burrow tracks on skin",
      "Small red bumps or blisters",
      "Sores from scratching",
      "Thick crusts on skin (Norwegian scabies)",
    ],
    causes: [
      "Sarcoptes scabiei mite",
      "Prolonged skin-to-skin contact",
      "Sharing bedding or clothing",
      "Crowded living conditions",
    ],
    commonLocations: ["Between fingers", "Wrists", "Waistline", "Inner elbows", "Genitals"],
    whenToSeeDoctor:
      "See a doctor for prescription treatment (permethrin cream or oral ivermectin). All household members and close contacts should be treated simultaneously.",
  },

  Seborrheic_Keratoses: {
    id: "Seborrheic_Keratoses",
    displayName: "Seborrheic Keratoses",
    category: "Neoplastic",
    severity: "low",
    description:
      "Common, harmless, non-cancerous skin growths that appear as waxy, stuck-on, brown, black, or tan patches. Very common in adults over 50. No treatment needed unless bothersome.",
    symptoms: [
      "Waxy, stuck-on appearance",
      "Round or oval shaped",
      "Brown, black, or tan coloring",
      "Slightly elevated with a rough texture",
      "Multiple growths may appear over time",
    ],
    causes: [
      "Aging (most common cause)",
      "Genetic factors",
      "Sun exposure history",
      "Not caused by virus or infection",
    ],
    commonLocations: ["Face", "Chest", "Back", "Shoulders", "Abdomen"],
    whenToSeeDoctor:
      "See a dermatologist if a growth changes rapidly, bleeds, or looks different from your other keratoses. Removal is optional and cosmetic.",
  },

  Tinea_Fungal_Infection: {
    id: "Tinea_Fungal_Infection",
    displayName: "Tinea (Ringworm) Infection",
    category: "Fungal",
    severity: "low",
    description:
      "A common fungal infection that creates ring-shaped, red, scaly patches on the skin. Despite the name 'ringworm,' it is caused by fungi, not worms. Highly contagious.",
    symptoms: [
      "Ring-shaped, red, scaly patch",
      "Clear or normal skin in the center",
      "Expanding red border",
      "Itching and irritation",
      "Multiple rings may overlap",
    ],
    causes: [
      "Dermatophyte fungi",
      "Direct contact with infected person or animal",
      "Contaminated objects (towels, combs)",
      "Warm, humid environments",
    ],
    commonLocations: ["Body (tinea corporis)", "Scalp (tinea capitis)", "Groin (jock itch)", "Beard area"],
    whenToSeeDoctor:
      "See a doctor if the infection doesn't improve with OTC antifungals after 2 weeks, if it's on the scalp, or if you have a weakened immune system.",
  },

  Urticaria_Hives: {
    id: "Urticaria_Hives",
    displayName: "Urticaria (Hives)",
    category: "Allergic",
    severity: "moderate",
    description:
      "Raised, itchy welts (wheals) on the skin that appear suddenly, often as an allergic reaction. Individual welts typically last less than 24 hours, but new ones may keep appearing.",
    symptoms: [
      "Raised, red or skin-colored welts",
      "Intense itching or burning",
      "Welts that change shape or merge",
      "Blanching (turns white when pressed)",
      "Swelling of lips, eyelids, or throat (angioedema)",
    ],
    causes: [
      "Allergic reactions (food, medication, insect stings)",
      "Infections",
      "Physical triggers (cold, pressure, exercise)",
      "Stress or autoimmune conditions",
    ],
    commonLocations: ["Trunk", "Arms", "Legs", "Face", "Any body surface"],
    whenToSeeDoctor:
      "Seek EMERGENCY care if hives are accompanied by difficulty breathing, throat swelling, dizziness, or rapid heartbeat (anaphylaxis). See a doctor if hives persist beyond 6 weeks.",
  },

  VZV_Viral_Infection: {
    id: "VZV_Viral_Infection",
    displayName: "VZV Viral Infection (Shingles / Chickenpox)",
    category: "Viral",
    severity: "high",
    description:
      "Infections caused by varicella-zoster virus (VZV). Primary infection causes chickenpox; reactivation later in life causes shingles (herpes zoster) — a painful, blistering rash along a nerve path.",
    symptoms: [
      "Pain, burning, or tingling before rash appears",
      "Band-like rash on one side of the body",
      "Fluid-filled blisters that crust over",
      "Fever and general malaise",
      "Sensitivity to touch in affected area",
    ],
    causes: [
      "Varicella-zoster virus reactivation",
      "Weakened immune system",
      "Aging (risk increases after 50)",
      "Stress or illness as triggers",
    ],
    commonLocations: ["Trunk (band-like pattern)", "Face", "Around one eye", "Neck"],
    whenToSeeDoctor:
      "See a doctor within 72 hours of rash onset — antiviral treatment is most effective when started early. Seek urgent care if the rash is near the eye.",
  },

  Vascular_Tumors: {
    id: "Vascular_Tumors",
    displayName: "Vascular Tumors",
    category: "Vascular",
    severity: "moderate",
    description:
      "Growths formed from blood vessels, including hemangiomas, pyogenic granulomas, and Kaposi's sarcoma. Most are benign, but some require evaluation to rule out malignancy.",
    symptoms: [
      "Red, purple, or blue skin growth",
      "Soft, compressible lump",
      "May bleed easily if traumatized",
      "Can grow rapidly (especially in infants)",
      "Usually painless unless ulcerated",
    ],
    causes: [
      "Abnormal blood vessel proliferation",
      "Congenital (present at birth)",
      "Hormonal influences",
      "Some types linked to viral infections (Kaposi's)",
    ],
    commonLocations: ["Face", "Scalp", "Trunk", "Limbs", "Lips"],
    whenToSeeDoctor:
      "See a dermatologist for any rapidly growing, bleeding, or ulcerated vascular lesion. Kaposi's sarcoma requires oncology referral.",
  },

  Warts: {
    id: "Warts",
    displayName: "Warts",
    category: "Viral",
    severity: "low",
    description:
      "Common, benign skin growths caused by human papillomavirus (HPV) infection of the top layer of skin. They are contagious and can spread by direct contact or contaminated surfaces.",
    symptoms: [
      "Small, rough, grainy bumps",
      "Flesh-colored, white, pink, or tan",
      "Black pinpoint dots (clotted blood vessels)",
      "Rough to the touch",
      "May appear singly or in clusters",
    ],
    causes: [
      "Human papillomavirus (HPV)",
      "Direct skin-to-skin contact",
      "Touching contaminated surfaces",
      "Breaks in the skin allowing entry",
    ],
    commonLocations: ["Fingers", "Hands", "Feet (plantar warts)", "Face", "Knees"],
    whenToSeeDoctor:
      "See a doctor if warts are painful, change appearance, spread rapidly, interfere with activities, or if you have a weakened immune system.",
  },
};

/**
 * Look up disease info by the class name returned from the backend.
 * Returns undefined if the disease is not found in the database.
 */
export function getDiseaseInfo(className: string): DiseaseInfo | undefined {
  return DISEASE_DATABASE[className];
}

/**
 * Get all diseases as an array, sorted alphabetically by display name.
 */
export function getAllDiseases(): DiseaseInfo[] {
  return Object.values(DISEASE_DATABASE).sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
  );
}

/**
 * Severity metadata for UI display.
 */
export const SEVERITY_CONFIG = {
  low: {
    label: "Low Severity",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
    icon: "🟢",
  },
  moderate: {
    label: "Moderate Severity",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
    icon: "🟡",
  },
  high: {
    label: "High Severity",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
    ring: "ring-orange-500/20",
    icon: "🟠",
  },
  critical: {
    label: "Critical — See a Doctor",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    ring: "ring-red-500/20",
    icon: "🔴",
  },
} as const;
