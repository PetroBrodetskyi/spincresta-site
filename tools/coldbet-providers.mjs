import { resolveReviewProviders } from '../scripts/provider-logo-library.js';

// Individual entries in the verified English slots filter, not a list for every market.
const verifiedProviderIds = `
  pragmatic-play evolution netent nolimit-city big-time-gaming bgaming red-tiger
  habanero spinomenal betsoft-gaming endorphina egt-digital ka-gaming winfinity
  evoplay aviatrix 100hp-gaming 155 1spin4win 1x2gaming 3-oaks
  77-gaming advantplay agt-software amarix amatic amigo apollo-games
  arrr-gaming astriona atlas-v atomic-slot-lab aviator baas-games barbara-bang
  belatra bf-games bigpot-gaming black-lagoon-games booming-games caleta-gaming charismatic-slots
  clawbuster cq9 creative-gaming ct-interactive dlv esa-gaming eurasian-gaming
  fa-chai-gaming fastspin-slot formula-spin fugaso funky g-gaming gameart
  gamebeat gaming-corps gamomat genesis gmw gold-stallion golden-race
  hacksaw-gaming holle-games imoon indigo-magic inout iron-dog joyspins
  kalamba-games kiron-interactive lambda-gaming leap live-games mancala manna-play
  mascot mega7 mga netgame ngmgame nobles-gaming onetouch
  onlyplay optimo-play oryx pateplay pg-soft pixmove platipus
  playson playstar poggiplay popiplay r-franco radi8 red-carat
  red-rake reevo riddec-games ruby-play slotopia solidicon spade-gaming
  spinfury spinmatic spinoro spinthon swintt tada-gaming the-hood
  thunderspin tom-horn triple-cherry triple-pg true-labs turbo-games voltent
  whoah-labs winspinity yggdrasil zephyr-slots zeppelin zeus zillion-games
`.trim().split(/\s+/);

export const providers = resolveReviewProviders(verifiedProviderIds);
export const providerFilterCount = verifiedProviderIds.length;
