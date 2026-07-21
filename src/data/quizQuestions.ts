import type { BeautyCategory, QuizQuestion } from '../types';

export const quizQuestions: Record<BeautyCategory, QuizQuestion[]> = {
  skin: [
    {
      id: 'skin_type',
      question: 'What is your skin type?',
      type: 'single',
      options: [
        {
          id: 'oily',
          label: 'Oily',
          hint: 'My skin gets shiny throughout the day, especially in the T-zone',
        },
        {
          id: 'dry',
          label: 'Dry',
          hint: 'My skin often feels tight or flaky',
        },
        {
          id: 'combination',
          label: 'Combination',
          hint: 'Oily in some areas, dry in others',
        },
        {
          id: 'normal',
          label: 'Normal',
          hint: 'Generally balanced, not too oily or dry',
        },
      ],
    },
    {
      id: 'reactivity',
      question: 'How reactive is your skin?',
      type: 'single',
      options: [
        {
          id: 'very',
          label: 'Very reactive',
          hint: 'I get redness, irritation, or breakouts from new products often',
        },
        {
          id: 'somewhat',
          label: 'Somewhat reactive',
          hint: 'Occasional reactions but generally manageable',
        },
        {
          id: 'not_very',
          label: 'Not very reactive',
          hint: 'I can try most products without issues',
        },
      ],
    },
    {
      id: 'sensitivities',
      question: 'Do you have any known skin sensitivities or ingredients you avoid?',
      type: 'multi',
      options: [
        { id: 'fragrance', label: 'Fragrance' },
        { id: 'alcohol', label: 'Alcohol' },
        { id: 'essential_oils', label: 'Essential oils' },
        { id: 'nuts', label: 'Nuts' },
        { id: 'pollen', label: 'Pollen' },
        { id: 'sulphates', label: 'Sulphates' },
        { id: 'retinol', label: 'Retinol' },
        { id: 'none', label: 'None that I know of' },
        { id: 'others', label: 'Others' },
      ],
    },
    {
      id: 'concerns',
      question: 'What are your top skin concerns? (pick up to 3)',
      type: 'multi',
      maxSelect: 3,
      options: [
        { id: 'acne', label: 'Acne and breakouts' },
        { id: 'sensitive', label: 'Sensitive skin' },
        { id: 'dark_spots', label: 'Dark spots' },
        { id: 'texture', label: 'Uneven texture' },
        { id: 'dullness', label: 'Dullness' },
        { id: 'fine_lines', label: 'Fine lines' },
        { id: 'redness', label: 'Redness' },
        { id: 'dark_circles', label: 'Dark circles' },
      ],
    },
    {
      id: 'spf',
      question: 'How often do you wear SPF?',
      type: 'single',
      options: [
        { id: 'every_day', label: 'Every day' },
        { id: 'sometimes', label: 'Sometimes' },
        { id: 'rarely', label: 'Rarely' },
        { id: 'never', label: 'Never' },
      ],
    },
  ],
  makeup: [
    {
      id: 'skin_tone',
      question: 'What is your skin tone?',
      type: 'single',
      options: [
        {
          id: 'fair',
          label: 'Fair',
          hint: 'Light skin with minimal natural pigmentation',
        },
        {
          id: 'light',
          label: 'Light',
          hint: 'Light with warm, neutral, or cool undertones',
        },
        {
          id: 'medium',
          label: 'Medium',
          hint: 'Olive or golden undertones',
        },
        {
          id: 'tan',
          label: 'Tan',
          hint: 'Deeper, warm-toned complexion',
        },
        {
          id: 'deep',
          label: 'Deep',
          hint: 'Rich, deep skin with warm or cool undertones',
        },
      ],
    },
    {
      id: 'undertones',
      question: 'What are your undertones?',
      type: 'single',
      options: [
        {
          id: 'cool',
          label: 'Cool',
          hint: 'Veins look bluish or purple, suit silver jewellery',
        },
        {
          id: 'warm',
          label: 'Warm',
          hint: 'Veins look greenish, suit gold jewellery',
        },
        {
          id: 'olive',
          label: 'Olive',
          hint: 'Greenish or yellowish cast',
        },
        {
          id: 'neutral',
          label: 'Neutral',
          hint: 'A mix of both, most shades work well',
        },
      ],
    },
    {
      id: 'makeup_style',
      question: 'How would you describe your makeup style? (select all that apply)',
      type: 'multi',
      options: [
        { id: 'none', label: 'No makeup — fully bare face' },
        { id: 'minimal', label: 'Minimal — light coverage, natural finish' },
        { id: 'everyday', label: 'Everyday colour — mascara, blush, tint' },
        { id: 'full_glam', label: 'Full glam — bold or creative looks' },
        { id: 'skincare_first', label: 'Skincare-first — prep and base' },
        { id: 'eye_looks', label: 'Eye looks — eyes are my main focus' },
        { id: 'lip_focus', label: 'Lip focus — a great lip is my signature' },
      ],
    },
  ],
  hair: [
    {
      id: 'hair_type',
      question: 'What is your hair type?',
      type: 'single',
      options: [
        { id: 'straight', label: 'Straight', hint: 'Lies flat naturally' },
        { id: 'wavy', label: 'Wavy', hint: 'A natural S-shape or slight bend' },
        { id: 'curly', label: 'Curly', hint: 'Defined curls or ringlets' },
        {
          id: 'coily',
          label: 'Coily or kinky',
          hint: 'Tight coils or very textured',
        },
      ],
    },
    {
      id: 'scalp_type',
      question: 'What is your scalp type?',
      type: 'single',
      options: [
        {
          id: 'oily',
          label: 'Oily',
          hint: 'Gets greasy quickly, even after washing',
        },
        { id: 'dry', label: 'Dry', hint: 'Feels itchy, or often flaky' },
        { id: 'balanced', label: 'Balanced', hint: 'No major concerns' },
        {
          id: 'sensitive',
          label: 'Sensitive',
          hint: 'Reacts to certain products or ingredients',
        },
      ],
    },
    {
      id: 'go_to_style',
      question: 'What is your go-to hair style?',
      type: 'single',
      options: [
        { id: 'down_natural', label: 'Wear it down unstyled, natural' },
        { id: 'blowout', label: 'Blowout or heat-styled' },
        { id: 'air_dried', label: 'Air-dried, minimal product or effort' },
        { id: 'tied_up', label: 'Tied up' },
        {
          id: 'protective',
          label: 'Protective styles (braids, twists, wigs, or extensions)',
        },
      ],
    },
    {
      id: 'hair_concerns',
      question: 'What are your top hair concerns? (pick up to 2)',
      type: 'multi',
      maxSelect: 2,
      options: [
        { id: 'frizz', label: 'Frizz' },
        { id: 'damage', label: 'Damage' },
        { id: 'oiliness', label: 'Oiliness' },
        { id: 'dryness', label: 'Dryness' },
        { id: 'hair_loss', label: 'Hair loss' },
        { id: 'colour', label: 'Colour-treated hair' },
        { id: 'dandruff', label: 'Dandruff' },
      ],
    },
  ],
  lifestyle: [
    {
      id: 'fragrance',
      question: 'What fragrance profile do you prefer?',
      type: 'single',
      options: [
        {
          id: 'fresh',
          label: 'Light and fresh',
          hint: 'Clean, citrus, or aquatic scents',
        },
        {
          id: 'floral',
          label: 'Floral',
          hint: 'Rose, jasmine, or soft botanicals',
        },
        {
          id: 'woody',
          label: 'Woody or musky',
          hint: 'Earthy, warm, or sensual tones',
        },
        {
          id: 'sweet',
          label: 'Sweet or gourmand',
          hint: 'Vanilla, caramel, or dessert-like',
        },
        { id: 'any', label: 'No preference — open to anything' },
      ],
    },
    {
      id: 'wellness',
      question: 'What does your wellness focus look like? (pick all that apply)',
      type: 'multi',
      options: [
        { id: 'energy', label: 'Energy and focus' },
        { id: 'sleep', label: 'Sleep and recovery' },
        { id: 'gut', label: 'Gut health' },
        { id: 'skin_within', label: 'Skin from within — supplements' },
        { id: 'stress', label: 'Stress and calm' },
      ],
    },
  ],
};

export const categoryLabels: Record<BeautyCategory, string> = {
  skin: 'Skin',
  makeup: 'Makeup',
  hair: 'Hair',
  lifestyle: 'Lifestyle',
};

/** Simple tips derived from answers for results view */
export function buildResultsCopy(
  category: BeautyCategory,
  answers: Record<string, string | string[]>,
): { title: string; rows: { label: string; value: string }[]; tips: string[] } {
  const asText = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v.join(', ') : v ?? '—';

  if (category === 'skin') {
    return {
      title: 'Your skin profile',
      rows: [
        { label: 'Skin type', value: asText(answers.skin_type) },
        { label: 'Reactivity', value: asText(answers.reactivity) },
        { label: 'Sensitivities', value: asText(answers.sensitivities) },
        { label: 'Top concerns', value: asText(answers.concerns) },
        { label: 'SPF habit', value: asText(answers.spf) },
      ],
      tips: [
        'Look for gentle, barrier-supporting ingredients like ceramides and panthenol.',
        'Patch-test new actives if your skin is reactive.',
        'Daily SPF remains the strongest long-term investment for your skin.',
      ],
    };
  }
  if (category === 'makeup') {
    return {
      title: 'Your makeup profile',
      rows: [
        { label: 'Skin tone', value: asText(answers.skin_tone) },
        { label: 'Undertones', value: asText(answers.undertones) },
        { label: 'Style', value: asText(answers.makeup_style) },
      ],
      tips: [
        'Match foundation undertones first — tone second.',
        'Build coverage in thin layers for a skin-like finish.',
      ],
    };
  }
  if (category === 'hair') {
    return {
      title: 'Your hair profile',
      rows: [
        { label: 'Hair type', value: asText(answers.hair_type) },
        { label: 'Scalp type', value: asText(answers.scalp_type) },
        { label: 'Go-to style', value: asText(answers.go_to_style) },
        { label: 'Concerns', value: asText(answers.hair_concerns) },
      ],
      tips: [
        'Treat scalp and lengths as two different zones.',
        'Heat protectant is non-negotiable for heat styling.',
      ],
    };
  }
  return {
    title: 'Your lifestyle profile',
    rows: [
      { label: 'Fragrance', value: asText(answers.fragrance) },
      { label: 'Wellness focus', value: asText(answers.wellness) },
    ],
    tips: [
      'Layer scent lightly on pulse points and hair mist for longer wear.',
      'Consistency beats intensity for wellness routines.',
    ],
  };
}
