export function activityForSlide(slide) {
  if (slide.type === 'cover') return 'opening';
  // Slides de questão só colocam a plateia em modo de votação enquanto o
  // gabarito não foi revelado.
  if (slide.poll && !slide.reveal) return `poll:${slide.poll}`;
  if (slide.type === 'closing') return 'closing';
  return 'stage';
}
