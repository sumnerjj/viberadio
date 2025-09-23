// Comprehensive radio station database for testing
// Sources: SomaFM, Radio Paradise, Public Radio, Internet Radio, etc.

export interface RadioStation {
  name: string;
  url: string;
  fallbackUrl?: string;
  genre: string;
  country: string;
  language: string;
  frequency?: number;
  tested?: boolean;
  working?: boolean;
  error?: string;
}

export const RADIO_STATIONS: RadioStation[] = [
  // SomaFM Stations (known for good CORS support)
  { name: "SomaFM Groove Salad", url: "https://ice1.somafm.com/groovesalad-256-mp3", genre: "Ambient", country: "USA", language: "English" },
  { name: "SomaFM Drone Zone", url: "https://ice1.somafm.com/dronezone-256-mp3", genre: "Ambient", country: "USA", language: "English" },
  { name: "SomaFM Lush", url: "https://ice1.somafm.com/lush-256-mp3", genre: "Ambient", country: "USA", language: "English" },
  { name: "SomaFM Beat Blender", url: "https://ice1.somafm.com/beatblender-256-mp3", genre: "Electronic", country: "USA", language: "English" },
  { name: "SomaFM Space Station", url: "https://ice1.somafm.com/spacestation-256-mp3", genre: "Electronic", country: "USA", language: "English" },
  { name: "SomaFM Indie Pop", url: "https://ice1.somafm.com/indiepop-256-mp3", genre: "Indie", country: "USA", language: "English" },
  { name: "SomaFM Folk Forward", url: "https://ice1.somafm.com/folkfwd-256-mp3", genre: "Folk", country: "USA", language: "English" },
  { name: "SomaFM Deep Space One", url: "https://ice1.somafm.com/deepspaceone-256-mp3", genre: "House", country: "USA", language: "English" },
  { name: "SomaFM Secret Agent", url: "https://ice1.somafm.com/secretagent-256-mp3", genre: "Lounge", country: "USA", language: "English" },
  { name: "SomaFM Boot Liquor", url: "https://ice1.somafm.com/bootliquor-256-mp3", genre: "Blues", country: "USA", language: "English" },
  { name: "SomaFM Suburbs of Goa", url: "https://ice1.somafm.com/suburbsofgoa-256-mp3", genre: "Ambient", country: "USA", language: "English" },
  { name: "SomaFM Thistle Radio", url: "https://ice1.somafm.com/thistle-256-mp3", genre: "Celtic", country: "Ireland", language: "English" },
  { name: "SomaFM Metal Detector", url: "https://ice1.somafm.com/metal-256-mp3", genre: "Metal", country: "USA", language: "English" },
  { name: "SomaFM Covers", url: "https://ice1.somafm.com/covers-256-mp3", genre: "Cover Songs", country: "USA", language: "English" },
  { name: "SomaFM Cliq Hop", url: "https://ice1.somafm.com/cliqhop-256-mp3", genre: "Hip Hop", country: "USA", language: "English" },
  { name: "SomaFM Bagel Radio", url: "https://ice1.somafm.com/bagel-256-mp3", genre: "Eclectic", country: "USA", language: "English" },
  { name: "SomaFM Left Coast 70s", url: "https://ice1.somafm.com/seventies-256-mp3", genre: "70s Rock", country: "USA", language: "English" },
  { name: "SomaFM PopTron", url: "https://ice1.somafm.com/poptron-256-mp3", genre: "Electronic Pop", country: "USA", language: "English" },
  { name: "SomaFM Sonic Universe", url: "https://ice1.somafm.com/sonicuniverse-256-mp3", genre: "Progressive", country: "USA", language: "English" },
  { name: "SomaFM ThistleRadio", url: "https://ice1.somafm.com/thistle-256-mp3", genre: "Celtic", country: "Ireland", language: "English" },

  // Radio Paradise (known working)
  { name: "Radio Paradise Main", url: "https://stream.radioparadise.com/mp3-128", fallbackUrl: "https://stream.radioparadise.com/aac-128", genre: "Eclectic", country: "USA", language: "English" },
  { name: "Radio Paradise Mellow", url: "https://stream.radioparadise.com/mellow-128", fallbackUrl: "https://stream.radioparadise.com/mellow-aac", genre: "Mellow", country: "USA", language: "English" },
  { name: "Radio Paradise Rock", url: "https://stream.radioparadise.com/rock-128", fallbackUrl: "https://stream.radioparadise.com/rock-aac", genre: "Rock", country: "USA", language: "English" },
  { name: "Radio Paradise World", url: "https://stream.radioparadise.com/world-128", fallbackUrl: "https://stream.radioparadise.com/world-aac", genre: "World", country: "USA", language: "English" },

  // Public Radio International
  { name: "WFMU", url: "https://stream0.wfmu.org/freeform-128k", fallbackUrl: "https://stream2.wfmu.org/freeform-128k", genre: "Freeform", country: "USA", language: "English" },
  { name: "KCRW", url: "https://kcrw.streamguys1.com/kcrw_128k_mp3_on_air", genre: "Eclectic", country: "USA", language: "English" },
  { name: "WXPN", url: "https://wxpnhi.xpn.org/xpnhi", genre: "Adult Alternative", country: "USA", language: "English" },
  { name: "KEXP", url: "https://kexp-mp3-128.streamguys1.com/kexp128.mp3", genre: "Alternative", country: "USA", language: "English" },
  { name: "WNYC", url: "https://fm939.wnyc.org/wnycfm", genre: "Public Radio", country: "USA", language: "English" },

  // Jazz Stations
  { name: "Jazz24", url: "https://live.wostreaming.net/direct/ppm-jazz24mp3-ibc3", genre: "Jazz", country: "USA", language: "English" },
  { name: "Radio Swiss Jazz", url: "https://stream.srg-ssr.ch/m/rsj/mp3_128", genre: "Jazz", country: "Switzerland", language: "Multi" },
  { name: "Jazz FM London", url: "https://edge-bauerfm-01-gos2.sharp-stream.com/jazzhigh.mp3", genre: "Jazz", country: "UK", language: "English" },
  { name: "Smooth Jazz", url: "https://streaming.exclusive.radio/er/smoothjazz/icecast.audio", genre: "Smooth Jazz", country: "USA", language: "English" },

  // Classical Stations
  { name: "Classical MPR", url: "https://classical.streamguys1.com/classical-128k", genre: "Classical", country: "USA", language: "English" },
  { name: "WQXR", url: "https://stream.wqxr.org/wqxr", genre: "Classical", country: "USA", language: "English" },
  { name: "Radio Swiss Classical", url: "https://stream.srg-ssr.ch/m/rsc_de/mp3_128", genre: "Classical", country: "Switzerland", language: "Multi" },
  { name: "Venice Classic Radio", url: "https://uk4.streamingpulse.com/ssl/VeniceClassicRadio", genre: "Classical", country: "Italy", language: "Italian" },

  // Electronic/Dance
  { name: "NTS Radio 1", url: "https://stream-relay-geo.ntslive.net/stream", genre: "Electronic", country: "UK", language: "English" },
  { name: "NTS Radio 2", url: "https://stream-relay-geo.ntslive.net/stream2", genre: "Electronic", country: "UK", language: "English" },
  { name: "Radio FG", url: "https://radiofg.impek.com/fg", genre: "Electronic", country: "France", language: "French" },
  { name: "FluxFM", url: "https://streams.fluxfm.de/Flux/mp3-320/streams.fluxfm.de/", genre: "Electronic", country: "Germany", language: "German" },
  { name: "Ibiza Global Radio", url: "https://server9.emitironline.com:18292/stream", genre: "Electronic", country: "Spain", language: "Spanish" },

  // Rock Stations
  { name: "Planet Rock", url: "https://stream-mz.planetradio.co.uk/planetrock.mp3", genre: "Rock", country: "UK", language: "English" },
  { name: "Classic Rock 109", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/CLASSICROCK_WEB.mp3", genre: "Classic Rock", country: "USA", language: "English" },
  { name: "Radio Caroline", url: "https://sc6.radiocaroline.net:8040/stream", genre: "Rock", country: "UK", language: "English" },

  // Hip Hop/R&B
  { name: "Hot 97", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/WQHTFMAAC.aac", genre: "Hip Hop", country: "USA", language: "English" },
  { name: "Power 106", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/KPWRFMAAC.aac", genre: "Hip Hop", country: "USA", language: "English" },

  // International Stations
  { name: "FIP France", url: "https://direct.fipradio.fr/live/fip-midfi.mp3", genre: "Eclectic", country: "France", language: "French" },
  { name: "BBC Radio 1", url: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one", genre: "Pop", country: "UK", language: "English" },
  { name: "BBC Radio 6 Music", url: "https://stream.live.vc.bbcmedia.co.uk/bbc_6music", genre: "Alternative", country: "UK", language: "English" },
  { name: "Radio France Inter", url: "https://direct.franceinter.fr/live/franceinter-midfi.mp3", genre: "Talk", country: "France", language: "French" },
  { name: "Deutschlandfunk", url: "https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3", genre: "Talk", country: "Germany", language: "German" },

  // Ambient/Chill
  { name: "Chillout Zone", url: "https://chillout.zone:8000/radio.mp3", genre: "Chillout", country: "Germany", language: "English" },
  { name: "Ambient Radio", url: "https://radio.stereoscenic.com/asp-h", genre: "Ambient", country: "USA", language: "English" },
  { name: "Hearts of Space", url: "https://stream.hos.com/128k", genre: "Ambient", country: "USA", language: "English" },

  // Folk/Country
  { name: "Americana Music", url: "https://stream.streamgenial.com:8040/americana128", genre: "Americana", country: "USA", language: "English" },
  { name: "Folk Alley", url: "https://live.streamguys1.com/folk", genre: "Folk", country: "USA", language: "English" },

  // World Music
  { name: "Radio Mundo", url: "https://stream.radiomundo.com.ar:8000/rmundo", genre: "World", country: "Argentina", language: "Spanish" },
  { name: "Afropop", url: "https://playerservices.streamtheworld.com/api/livestream-redirect/AFROPOP.mp3", genre: "Afropop", country: "USA", language: "English" },

  // Metal/Hard Rock
  { name: "Metal Devastation Radio", url: "https://live.metaldevastationradio.com/8000/mdronair.mp3", genre: "Metal", country: "USA", language: "English" },
  { name: "Radio Metal", url: "https://radiometal.ice.infomaniak.ch/radiometal-128.mp3", genre: "Metal", country: "France", language: "French" },

  // Reggae
  { name: "Irie FM", url: "https://iriefm.cdnstream1.com:8014/live", genre: "Reggae", country: "Jamaica", language: "English" },
  { name: "Reggae141", url: "https://streaming.radio.co/sfe2a994bd/listen", genre: "Reggae", country: "UK", language: "English" },

  // News/Talk
  { name: "NPR News", url: "https://npr-ice.streamguys1.com/live.mp3", genre: "News", country: "USA", language: "English" },
  { name: "BBC World Service", url: "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service", genre: "News", country: "UK", language: "English" },

  // Alternative URLs for testing
  { name: "Radio Paradise Alt", url: "https://stream.radioparadise.com/flac", genre: "Eclectic", country: "USA", language: "English" },
  { name: "SomaFM Groove Alt", url: "https://somafm.com/groovesalad130.pls", genre: "Ambient", country: "USA", language: "English" },
  { name: "KEXP Alt", url: "https://kexp.streamguys1.com/kexp160.mp3", genre: "Alternative", country: "USA", language: "English" },

  // More Electronic
  { name: "Radio Record", url: "https://radiorecord.hostingradio.ru/rr_main96.aacp", genre: "Electronic", country: "Russia", language: "Russian" },
  { name: "1.FM Trance", url: "https://strm112.1.fm/trance_mobile_mp3", genre: "Trance", country: "Switzerland", language: "English" },
  { name: "DI.FM Trance", url: "https://prem2.di.fm/trance?listen=71cfadb31ee8d3aafbb27394d8c8e7a5", genre: "Trance", country: "USA", language: "English" },

  // More Jazz
  { name: "WBGO Jazz", url: "https://wbgo.streamguys1.com/wbgo128", genre: "Jazz", country: "USA", language: "English" },
  { name: "Jazz Radio France", url: "https://jazzradio.ice.infomaniak.ch/jazzradio-high.mp3", genre: "Jazz", country: "France", language: "French" },

  // More Classical
  { name: "Classical KUSC", url: "https://classical-kusc.streamguys1.com/classical-kusc-mp3", genre: "Classical", country: "USA", language: "English" },
  { name: "WCPE Classical", url: "https://audio-mp3.ibiblio.org:8000/wcpe.mp3", genre: "Classical", country: "USA", language: "English" },

  // Indie/Alternative
  { name: "The Current", url: "https://current.stream.publicradio.org/kcmp.mp3", genre: "Alternative", country: "USA", language: "English" },
  { name: "KCSN", url: "https://kcsn.streamguys1.com/kcsn_mp3_hi", genre: "Alternative", country: "USA", language: "English" },

  // Blues
  { name: "Highway 61 Blues", url: "https://streaming.exclusive.radio/er/highway61/icecast.audio", genre: "Blues", country: "USA", language: "English" },
  { name: "Blues Radio UK", url: "https://stream.zeno.fm/f3fnpupf0f8uv", genre: "Blues", country: "UK", language: "English" },
];

export default RADIO_STATIONS;