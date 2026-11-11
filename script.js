/* ------------------------------------------------------------------
   CONTENT: swap in real facts, photos and logos here.

   Each designer has an overview (name, meta, blurb, facts, logo) and
   runway looks. Look 1 is the one shown first.

   Per look:
   show    label under the photo, e.g. "Fall 2016 · New York"
   labels  optional. Rename a slot, e.g. { head:"Headwear", legs:"Bottoms" }
   pieces  head, torso, legs, shoes. Each takes name, note and an optional
           facts:["...","..."] list that appears in the side panel

   Photos, pick one style:
   photo + pins   a single photo (4:5 portrait works best)
   views          several photos of the same look, e.g. front and back.
                  views:[
                    { name:"Front", photo:"images/a.jpg", pins:{...} },
                    { name:"Back",  photo:"images/a-back.jpg", pins:{...} }
                  ]
                  A Front / Back toggle appears when there is more than one.

   pins    optional. Move a callout onto the photo with x and y as
           percentages, and side "l" or "r" for which way the tag opens.
           Example: pins:{ head:{x:52,y:9,side:"l"} }
           Use shoes:null to hide a callout the photo doesn't show.
   zoom, focus  optional, on a photo or view. Example: zoom:1.06, focus:[.15,.5]

   Per designer:
   logo    logo image tiled behind the page and card ("" uses the wordmark)
   bg      full-page background photo, with dim (0 to 1) for the dark overlay
------------------------------------------------------------------- */
const KEYS = ["head","torso","legs","shoes"];
const SLOT = { head:"Head", torso:"Top", legs:"Bottom", shoes:"Shoes" };
const lab = (L, k) => (L.labels && L.labels[k]) || SLOT[k];
const NOTE = "Placeholder. Describe the piece and the look it came from.";
const DEFAULT_PINS = { head:{x:38,y:12,side:"r"}, torso:{x:38,y:32,side:"r"}, legs:{x:38,y:66,side:"r"}, shoes:{x:38,y:89,side:"r"} };

/* look(show, [head, torso, legs, shoes], extra) builds one runway look */
const look = (show, names, extra) => Object.assign({
  show, photo: "",
  pieces: Object.fromEntries(KEYS.map((k, i) => [k, { name: names[i], note: NOTE }]))
}, extra);

/* A look's photos: its views list, or a single view built from photo + pins */
const viewsOf = L => L.views || [{ name: "Front", photo: L.photo, pins: L.pins, zoom: L.zoom, focus: L.focus }];

/* Crop a photo in without re-exporting it: zoom (1 = none) and focus [across, down] */
function zoomImg(el, V) {
  el.style.cssText = "";
  const Z = V.zoom || 1; if (Z <= 1) return;
  const fx = V.focus ? V.focus[0] : .5, fy = V.focus ? V.focus[1] : .5;
  const p = v => (v * 100).toFixed(3) + "%";
  el.style.width = el.style.height = p(Z);
  el.style.left = p(-(Z - 1) * fx);
  el.style.top = p(-(Z - 1) * fy);
  el.style.clipPath = "inset(" + p((Z - 1) * fy / Z) + " " + p((Z - 1) * (1 - fx) / Z) + " " + p((Z - 1) * (1 - fy) / Z) + " " + p((Z - 1) * fx / Z) + " round 10px)";
}

/* Open a callout on whichever side has room, so tags never run off the card */
function fitSide(p, label, name, fw) {
  const w = Math.min(170, 34 + 6.6 * (label.length + name.length));
  const x = p.x / 100 * fw;
  const fitsR = x + 30 + w <= fw + 14, fitsL = x - 30 - w >= -14;
  if (p.side === "l") return (!fitsL && fitsR) ? "r" : "l";
  return (!fitsR && fitsL) ? "l" : "r";
}
function pinsHTML(L, V, fw, live) {
  return KEYS.filter(k => !(V.pins && V.pins[k] === null)).map(k => {
    const p = Object.assign({}, DEFAULT_PINS[k], V.pins && V.pins[k]);
    const name = L.pieces[k].name, label = lab(L, k);
    const left = fitSide(p, label, name, fw) === "l";
    return '<button type="button" class="pin' + (left ? " l" : "") + '" data-k="' + k + '" style="left:' + p.x + "%;top:" + p.y + '%"' +
      (live ? ' aria-pressed="false" aria-label="' + label + ": " + name + '"' : ' tabindex="-1"') +
      '><span class="dot"></span><span class="tag"><small>' + label + "</small>" + name + "</span></button>";
  }).join("");
}

const DESIGNERS = [
  { id:"kanye", name:"Kanye West", logo:"", bg:"images/yeezy-bg.jpg", dim:.4, wordmark:"YEEZY", accent:"#b89968",
    meta:"Yeezy, launched in 2015 with Adidas",
    blurb:"Streetwear built around muted earth tones, oversized shapes and a sneaker that changed resale culture.",
    facts:["The Yeezy Boost 350 debuted in 2015.","The palette leans on sand, clay and olive.","Fit is the signature: big, layered, lived-in."],
    looks:[
      look("Yeezy Season 1 · 2015", ["Hooded jacket","Work vest","Tapered pants","950 duck boots"], {
        photo: "images/yeezy-1.jpg",
        labels: { head:"Mid layer", torso:"Outer", legs:"Pants", shoes:"Boots" },
        pieces: {
          head:  { name:"Hooded jacket", note:"Black hooded jacket with a large hood, loose sleeves and a relaxed fit that extends below the waist, worn under the vest.", facts:["Matte black with very little visible detail.","Mixes the coverage of a field jacket with the comfort of a hoodie."] },
          torso: { name:"Work vest", note:"Cropped navy work vest with a wide, boxy fit, padded shoulders and large rectangular utility pockets across the front.", facts:["Inspired by military protective vests and industrial workwear.","Short body that ends around the waist, for oversized proportions."] },
          legs:  { name:"Tapered pants", note:"Black tapered trousers, loose through the thighs and narrowing to elasticated cuffs that sit above the boots.", facts:["Draws on military training trousers and athletic joggers."] },
          shoes: { name:"950 duck boots", note:"Dark brown military-style boots with tall lace-up uppers, rounded toes and thick rubber soles, worn over grey ribbed socks.", facts:["The Adidas Yeezy 950 duck boot was introduced as part of Season 1 in 2015.","The grey ribbed socks add coverage above the boots, in line with the collection’s practical, military feel."] }
        },
        pins: {
          head:  { x:49, y:17, side:"r" },
          torso: { x:47, y:32, side:"r" },
          legs:  { x:60, y:65, side:"r" },
          shoes: { x:44, y:92, side:"l" }
        }
      }),
      look("Yeezy Season 1 · February 12, 2015 · New York", ["Gold pendant","Bouclé sweater","Knit sweatpants","950 boots"], {
        photo: "images/yeezy-2.jpg",
        labels: { head:"Accessory", torso:"Top", legs:"Pants", shoes:"Boots" },
        pieces: {
          head:  { name:"Gold pendant", note:"Thin gold-tone chain with a small pendant resting at the centre of the chest, over the wide neckline.", facts:["The only touch of colour in an otherwise muted grey outfit."] },
          torso: { name:"Bouclé sweater", note:"Oversized grey bouclé sweater with a wide neckline, dropped shoulders and extra-long sleeves that run past the wrists.", facts:["Thick, textured knit with exposed shoulder seams and wide ribbed cuffs and hem.","The retail collection included a matching bouclé sweater and jogging trousers."] },
          legs:  { name:"Knit sweatpants", note:"Matching grey knit sweatpants, loose through the hips and thighs, with long ribbed cuffs that narrow toward the ankles.", facts:["Same textured knit as the sweater, so the two read as a set.","Heavy knitwear turns everyday sportswear into something more relaxed."] },
          shoes: { name:"950 boots", note:"Grey Yeezy 950 boots with a tall lace-up shaft, a padded ankle, rounded rubber toe caps and thick lug soles.", facts:["The Yeezy 950 was introduced in 2015 as Kanye West’s take on practical outdoor footwear.","Inspired by military combat boots and waterproof duck boots."] }
        },
        pins: {
          head:  { x:47, y:23, side:"r" },
          torso: { x:52, y:42, side:"r" },
          legs:  { x:42, y:67, side:"l" },
          shoes: { x:44, y:92, side:"l" }
        }
      }),
      look("Yeezy Season 1 · February 12, 2015 · New York", ["Long sleeve crew","Short sleeve crew","Worker pants","950 boots"], {
        photo: "images/yeezy-3.jpg",
        zoom: 1.06,
        focus: [.15, .5],
        labels: { head:"Inner", torso:"Outer", legs:"Pants", shoes:"Boots" },
        pieces: {
          head:  { name:"Long sleeve crew", note:"Darker brown long-sleeve crewneck with a thick, textured finish, ribbed cuffs and sleeves that cover part of the hands, with the hem showing under the outer layer.", facts:["Different shades of brown, textures and lengths create the layering, with no prints or logos."] },
          torso: { name:"Short sleeve crew", note:"Oversized dusty-taupe sweatshirt with a wide ribbed crewneck, dropped shoulders and large short sleeves that stop just above the elbows.", facts:["Raw-cut sleeve openings and visible shoulder stitching.","Draws on vintage athletic sweatshirts and military training clothing.","Part of the original Yeezy Season 1 retail collection."] },
          legs:  { name:"Worker pants", note:"Chocolate-brown worker pants, relaxed through the hips and thighs, with tapered legs and fabric that gathers around the knees and ankles.", facts:["Inspired by military field trousers and industrial workwear.","The narrow leg openings let the fabric gather naturally above the boots."] },
          shoes: { name:"950 boots", note:"Dark charcoal lace-up boots with a tall ankle shaft, reinforced rubber toe caps and thick rubber soles.", facts:["The Yeezy 950 mixes a durable nylon and textile upper with suede details and a heavy lug sole.","Inspired by military combat boots and waterproof duck boots."] }
        },
        pins: {
          head:  { x:65, y:50, side:"r" },
          torso: { x:50, y:25, side:"r" },
          legs:  { x:55, y:62, side:"r" },
          shoes: { x:43, y:92, side:"l" }
        }
      })
    ]},
  { id:"supreme", name:"Supreme", logo:"", bg:"images/supreme-bg.jpg", dim:.6, wordmark:"SUPREME", accent:"#d8262c",
    meta:"Founded in New York in 1994 by James Jebbia",
    blurb:"Born as a downtown New York skate shop, Supreme turned a red box logo and limited weekly drops into one of the most influential names in streetwear.",
    facts:["The first store opened in April 1994 on Lafayette Street in Manhattan, built as a skate shop.","The red box logo is set in Futura Heavy Oblique and draws on Barbara Kruger’s typographic art.","The 2017 collaboration with Louis Vuitton is among the best-known in streetwear.","EssilorLuxottica bought the brand from VF Corporation in 2024 for about $1.5 billion."],
    looks:[
      look("Fall 2025 · Week 1", ["Grey hoodie","Track jacket","Track pant","Air Max 2001"], {
        views: [
          { name:"Front", photo:"images/supreme-1.jpg", pins: {
              head:  { x:52, y:11, side:"r" },
              torso: { x:50, y:31, side:"l" },
              legs:  { x:58, y:72, side:"r" },
              shoes: { x:50, y:91, side:"l" } } },
          { name:"Back", photo:"images/supreme-1-back.jpg", pins: {
              head:  { x:53, y:12, side:"r" },
              torso: { x:53, y:32, side:"l" },
              legs:  { x:43, y:72, side:"r" },
              shoes: { x:49, y:93, side:"l" } } }
        ],
        labels: { head:"Headwear", torso:"Outerwear", legs:"Bottoms", shoes:"Footwear" },
        pieces: {
          head:  { name:"Grey hoodie", note:"Light grey pullover hoodie with the hood pulled over the head. Soft sweatshirt fabric and a relaxed opening around the face, sitting under the jacket’s high collar as an extra layer around the neck.", facts:["Grey hoodies have been a staple of Supreme’s collections since the brand’s early years.","Draws from American athletic clothing and New York skate culture."] },
          torso: { name:"Track jacket", note:"Supreme Spellout Embroidered Ripstop Track Jacket in black. Water-resistant cotton ripstop with a mesh body lining and taffeta sleeve lining, a high collar, a full-length zipper behind a snap placket, elastic cuffs and an adjustable drawcord hem. White piping runs across the chest beside a red-and-white shield crest and a small Supreme script logo.", facts:["Large outlined Supreme lettering covers the back in a cross-shaped arrangement.","Inspired by vintage football training jackets and European sportswear, in Supreme’s oversized fit.","Release: August 28, 2025 (Week 1) · Retail: $178 USD"] },
          legs:  { name:"Track pant", note:"Supreme Spellout Embroidered Ripstop Track Pant in black. Water-resistant cotton ripstop with mesh and taffeta lining, an elastic waistband with internal drawcord, side pockets, a zippered back pocket and adjustable drawcords at the ankles.", facts:["Large outlined Supreme lettering runs down the legs, with a red-and-white shield crest.","The wide fit and long legs let the fabric gather over the sneakers.","Drawn from football warm-up trousers and 1990s sportswear.","Release: August 28, 2025 (Week 1) · Retail: $158 USD"] },
          shoes: { name:"Air Max 2001", note:"Supreme x Nike Air Max 2001 Air Ecstasy in University Red, with a red quilted mesh upper, white reflective Supreme lettering and a bright yellow midsole.", facts:["3M reflective TPU panels run along the sides and heel, with reflective lace loops and a padded mesh collar.","A lightweight Phylon midsole holds transparent Air cushioning, over a black rubber outsole.","Revives Nike’s experimental early-2000s running shoes, with larger branding and updated reflective materials.","Release: August 27, 2026 · Retail: $188 USD · Product code: IM7412-600"] }
        }
      }),
      look("Spring 2026 · Week 9", ["Beanie and glasses","Hooded work jacket","Painter pant","Timberland boots"], {
        views: [
          { name:"Front", photo:"images/supreme-2.jpg", pins: {
              head:  { x:53, y:15, side:"l" },
              torso: { x:53, y:37, side:"l" },
              legs:  { x:48, y:70, side:"r" },
              shoes: { x:46, y:92, side:"r" } } },
          { name:"Back", photo:"images/supreme-2-back.jpg", pins: {
              head:  { x:56, y:14, side:"l" },
              torso: { x:58, y:48, side:"l" },
              legs:  { x:46, y:90, side:"r" },
              shoes: null } }
        ],
        labels: { head:"Headwear", torso:"Outerwear", legs:"Bottoms", shoes:"Footwear" },
        pieces: {
          head:  { name:"Beanie and glasses", note:"A black knit beanie sits under the jacket’s hood, close-fitting with a simple knit and no visible branding. Black rectangular glasses with a narrow frame and dark temples finish the face.", facts:["The beanie draws on cold-weather workwear and 1990s New York street fashion.","The glasses are a lightweight design inspired by everyday optical eyewear and the slim frames of the late 1990s and early 2000s.","A metallic ring adds a small piece of jewellery to the outfit."] },
          torso: { name:"Hooded work jacket", note:"Supreme x The Great China Wall Hooded Work Jacket in tan. Oversized, in 100% cotton canvas with 3M Thinsulate insulation, a quilted cotton poplin body lining and quilted taffeta sleeve lining. Full-length zipper, a front pouch pocket, an interior chest pocket, dark brown ribbed cuffs and waistband, and an embroidered Supreme logo patch near the hem.", facts:["Black rhinestones decorate the Gothic lettering across the hood and back.","Three illustrated women sit on the rear panel, also in rhinestones.","Inspired by vintage American work jackets, tattoo artwork and early-2000s embellished streetwear.","Release: April 23, 2026 (Week 9) · Retail: $698 USD"] },
          legs:  { name:"Painter pant", note:"Supreme x The Great China Wall Double Knee Painter Pant in tan. 100% cotton canvas in a loose, wide-leg fit with reinforced double-knee construction. Zip fly, a single coin pocket, copper oxide rivets, utility pockets, and a hammer loop on the left leg with woven logo taping.", facts:["Black Gothic Supreme lettering runs vertically down the left leg.","Printed graphics and rhinestone decorations cover the back.","Keeps the practical features of painter and carpenter trousers while adding the graphics associated with The Great China Wall.","Release: April 23, 2026 (Week 9) · Retail: $398 USD"] },
          shoes: { name:"Timberland boots", note:"Black Timberland lace-up boots with a rounded toe, a matte exterior and thick rubber lug soles. The oversized pants rest over the upper section.", facts:["Timberland became a major part of New York hip-hop culture in the 1990s, with artists pairing heavy boots with oversized jeans and workwear jackets.","Inspired by traditional industrial work boots.","The exact Timberland model is unconfirmed."] }
        }
      }),
      look("Fall/Winter 2026 · Week 7", ["GORE-TEX N-2B Jacket","Studded Belt","GORE-TEX Cargo Pant","Black Lug-Sole Boots"], {
        views: [
          { name:"Front", photo:"images/supreme-3.jpg", pins: {
              head:  { x:52, y:32, side:"r" },
              torso: { x:51, y:51, side:"l" },
              legs:  { x:50, y:72, side:"r" },
              shoes: { x:42, y:92, side:"l" } } },
          { name:"Back", photo:"images/supreme-3-back.jpg", pins: {
              head:  { x:52, y:30, side:"r" },
              torso: { x:50, y:49, side:"l" },
              legs:  { x:50, y:68, side:"r" },
              shoes: { x:40, y:92, side:"l" } } }
        ],
        labels: { head:"Outerwear", torso:"Accessory", legs:"Bottoms", shoes:"Footwear" },
        pieces: {
          head:  { name:"Supreme GORE-TEX N-2B Jacket", note:"Bright red oversized GORE-TEX N-2B Jacket featuring a waterproof, breathable two-layer polyester ripstop shell, fully taped seams, quilted logo lining, fixed fleece-lined split-zip snorkel hood with faux-fur trim, and large 3M reflective Supreme lettering.", facts:["Inspired by 1950s U.S. Air Force N-2B extreme cold weather flight jackets.","Release: October 1, 2026 (Fall/Winter 2026, Week 7) · Retail: $498 USD","Features 3M reflective ripstop appliqué lettering across the chest."] },
          torso: { name:"Silver-Tone Studded Belt", note:"Narrow black leather belt accented with closely set rectangular silver-tone studs, positioned between the cropped bomber jacket and wide-leg cargo pants.", facts:["Draws inspiration from 1970s British punk fashion and classic skate culture.","Provides a continuous metallic border highlighting the waist transition."] },
          legs:  { name:"Supreme GORE-TEX Cargo Pant", note:"Matching bright red waterproof GORE-TEX cargo pants in a wide-leg, relaxed fit with taped seams, slanted hand pockets, thigh cargo pockets, velcro waist adjusters, and elastic shock-cord cuffs.", facts:["Large arched reflective Supreme appliqué lettering extends across the rear seat.","Release: October 1, 2026 (Fall/Winter 2026, Week 7) · Retail: $298 USD"] },
          shoes: { name:"Black Lug-Sole Boots", note:"Black ankle-height boots featuring rounded toes, sturdy uppers, and heavy-duty rubber lug soles with deep tread patterns.", facts:["Utilitarian military and industrial boot construction.","Provides structure under the stacked cuffs of the wide-leg cargo pants."] }
        }
      })
    ]},
  { id:"margiela", name:"Maison Margiela", logo:"", bg:"images/margiela-bg.jpg", wordmark:"MAISON MARGIELA", accent:"#d4503f",
    meta:"Founded in Paris in 1988 by Martin Margiela",
    blurb:"Anonymous on purpose. Margiela deconstructs familiar clothes and reassembles them with a quiet, conceptual wink.",
    facts:[
      "The label is plain white cloth held by four signature stitches.",
      "The split-toe Tabi boot is its best-known silhouette.",
      "Early shows featured non-professional models and veiled faces to keep all focus on the clothes."
    ],
    looks:[
      look("MM6 Spring/Summer 2026 · Look 1", ["Lunettes 6 Sunglasses", "Flipped Sleeve Denim Jacket", "Wide-Leg Denim Jeans", "Brown Leather Loafers"], {
        views: [
          { name:"Front", photo:"images/margiela-1-front.jpg", pins: {
              head:  { x:47, y:11, side:"r" },
              torso: { x:48, y:32, side:"r" },
              legs:  { x:45, y:68, side:"r" },
              shoes: { x:44, y:94, side:"l" } } },
          { name:"Side", photo:"images/margiela-1-side.jpg", pins: {
              head:  { x:49, y:11, side:"r" },
              torso: { x:47, y:32, side:"r" },
              legs:  { x:46, y:68, side:"r" },
              shoes: { x:43, y:94, side:"l" } } },
          { name:"Back", photo:"images/margiela-1-back.jpg", pins: {
              head:  { x:49, y:10, side:"r" },
              torso: { x:50, y:32, side:"l" },
              legs:  { x:43, y:68, side:"r" },
              shoes: null } }
        ],
        labels: { head:"Eyewear", torso:"Outerwear", legs:"Bottoms", shoes:"Footwear" },
        pieces: {
          head:  { name:"Lunettes 6 Black Shield Sunglasses", note:"All-black wraparound shield sunglasses with a single lens across the face, hiding the eyes completely to fit the house's anonymity theme.", facts:["MM6 x Retrosuperfuture collaboration for SS26.","Revives an archival shield silhouette. Retail price: $439.90 USD."] },
          torso: { name:"Flipped Sleeve Denim Jacket", note:"Short, boxy dark indigo trucker jacket in 100% cotton unwashed ring denim with metal button front, chest flap pockets, raw frayed cuffs, and flipped sleeve construction creating an upper arm band.", facts:["Features MM6 signature white stitch line across the back.","Item code: SH2AM0073M30063962 · Retail: €790."] },
          legs:  { name:"Dark Blue Wide-Leg Jeans", note:"High-rise dark indigo wide-leg jeans with a slight flare toward the hem, pressed center creases, and an unwashed rinsed finish matching the jacket.", facts:["Relaxed, elongated cut designed to sit softly over the footwear."] },
          shoes: { name:"Brown Leather Loafers", note:"Polished dark burgundy-brown leather slip-on loafers featuring a rounded-square moc toe and a chunky rubber sole.", facts:["MM6 leather loafers in polished calfskin. Item code: SH3WR0008.P7560."] }
        }
      }),
      look("MM6 Spring/Summer 2026 · Look 2", ["Numeric Cotton T-Shirt", "Classic Small Japanese Bag", "Wool Shirting Trousers", "City Biker Loafers"], {
        views: [
          { name:"Front", photo:"images/margiela-2-front.jpg", pins: {
              head:  { x:50, y:28, side:"r" },
              torso: { x:30, y:68, side:"l" },
              legs:  { x:50, y:68, side:"r" },
              shoes: { x:46, y:94, side:"l" } } },
          { name:"Side", photo:"images/margiela-2-side.jpg", pins: {
              head:  { x:49, y:28, side:"r" },
              torso: { x:36, y:68, side:"l" },
              legs:  { x:52, y:68, side:"r" },
              shoes: { x:54, y:94, side:"r" } } }
        ],
        labels: { head:"Top", torso:"Accessory", legs:"Bottoms", shoes:"Footwear" },
        pieces: {
          head:  { name:"Numeric Cotton T-Shirt", note:"Heathered mid-grey crewneck T-shirt in 100% cotton jersey with a relaxed fit and a white numeric artwork label centered on the chest.", facts:["Made in Italy · Retail: €190 · Item code: SH0GC0071M20170856M.","Features signature MM6 white stitch line at the back."] },
          torso: { name:"Japanese Bag Classic Small", note:"Black triangular tote with origami-inspired folded geometry, smooth calf leather cuff handle embossed with numeric series 0-23, and press-stud side corner buttons.", facts:["Introduced in Autumn/Winter 2009 collection.","Made from 100% polyurethane with leather trim · Retail: €390 · Item code: S54WD0043P8396T8013."] },
          legs:  { name:"Wool Shirting Trousers", note:"Wide-leg anthracite grey trousers in lightweight woven wool shirting with a pleated front, sharp central crease, and embroidered numeric artwork.", facts:["Made in Italy · Retail: €590 · Item code: SH0KA0074M36006855."] },
          shoes: { name:"City Biker Loafers", note:"Black calf leather loafers fusing refined tailoring with biker attitude, featuring an embossed numeric vamp strap and rugged rubber lug sole.", facts:["Spring/Summer 2026 collection · Made in Italy · Item code: SH1WR0006P7431T8013."] }
        }
      }),
      look("Maison Margiela SS27 · Paris · Look 49", ["Deconstructed Trench Coat", "Floral Print Sheer Shirt", "Olive Silk-Satin Trousers", "Tabi Lace-up Shoes"], {
        photo: "images/margiela-3.jpg",
        labels: { head:"Outerwear", torso:"Innerwear", legs:"Bottoms", shoes:"Footwear" },
        pieces: {
          head:  { name:"Deconstructed Trench Coat", note:"Oversized grey-green deconstructed trench coat featuring epaulets, wide lapels, storm flaps, and unlined fluid tailoring.", facts:["Shown at Paris Fashion Week for Spring/Summer 2027 (Look 49).","Subverts traditional outerwear by playing with inside-out, finished and unfinished details."] },
          torso: { name:"Floral Print Sheer Shirt", note:"Lightweight semi-sheer top with an abstract muted floral print and raw-edge layered panels under the trench.", facts:["Adds a soft contrast to the structured, utilitarian trench coat."] },
          legs:  { name:"Olive Silk-Satin Trousers", note:"Fluid olive-green silk-satin wide-leg trousers with a rich sheen and a relaxed drape gathering over the shoes.", facts:["Features a luxurious sheen that catches the light on the runway."] },
          shoes: { name:"Tabi Lace-Up Shoes", note:"Black polished leather lace-up derby shoes with the iconic split-toe Tabi detail and dark soles.", facts:["The split-toe Tabi design was first created by Martin Margiela in 1988, inspired by traditional Japanese split-toe socks."] }
        },
        pins: {
          head:  { x:54, y:30, side:"r" },
          torso: { x:48, y:36, side:"l" },
          legs:  { x:47, y:72, side:"r" },
          shoes: { x:49, y:94, side:"l" }
        }
      })
    ]},
  { id:"ysl", name:"Saint Laurent", logo:"", bg:"images/saint-laurent-bg.jpg", wordmark:"SAINT LAURENT", accent:"#9b2d3f",
    meta:"Founded in Paris in 1961 by Yves Saint Laurent and Pierre Bergé",
    blurb:"Sharp, sensual and quietly rebellious. Yves Saint Laurent put women in tailoring and made Paris couture feel modern.",
    facts:["Yves Saint Laurent became head of Dior at just 21.","Le Smoking, the women’s tuxedo, debuted in 1966.","The Rive Gauche line brought ready-to-wear to the house in 1966.","The 1965 Mondrian dresses turned art into fashion.","Hedi Slimane’s menswear leaned on very slim black tailoring and skinny cigarette jeans.","Anthony Vaccarello took the look wider: his Spring/Summer 2020 collection used flared trousers and metallic embellishment."],
    looks:[
      look("Fall/Winter 2015 · Paris", ["Black sunglasses","Leather biker jacket","Black skinny jeans","Leather ankle boots"], {
        photo: "images/saint-laurent-1.jpg",
        labels: { head:"Shirt" },
        pieces: {
          head:  { name:"Striped Turtleneck", note:"The striped turtleneck reinterprets the traditional French Breton stripe, a pattern originally associated with French naval uniforms dating back to 1858. Hedi Slimane modernizes this historic motif by reversing its traditional colour palette, using black as the dominant colour with fine white horizontal stripes. This creates an interesting contrast between classic French fashion heritage and the darker, rebellious rock-and-roll aesthetic of the Fall/Winter 2015 collection." },
          torso: { name:"Cropped leather jacket", note:"Black leather biker jacket with front pockets, worn over a black-and-white striped mock-neck knit.", facts:["Black leather jackets were a staple of the Paris Sessions collection.","The striped knit underneath is another signature of the show."] },
          legs:  { name:"Black skinny jeans", note:"Slim, cigarette-cut black jeans, a Saint Laurent signature of the era." },
          shoes: { name:"Leather ankle boots", note:"Polished black leather ankle boots with a pointed toe." }
        },
        pins: {
          head:  { x:48, y:17, side:"r" },
          torso: { x:50, y:30, side:"l" },
          legs:  { x:50, y:64, side:"r" },
          shoes: { x:52, y:93, side:"l" }
        }
      }),
      look("Spring/Summer 2020 · Malibu", ["Embroidered shirt","Zip blazer","Flared trousers","Pointed boots"], {
        photo: "images/saint-laurent-2.jpg",
        labels: { head:"Shirt" },
        pieces: {
          head:  { name:"Embroidered shirt", note:"Black button-front shirt with silver embellishment across the chest, the most eye-catching part of the outfit.", facts:["Tiny silver discs hang from fine chains across the chest.","Real texture instead of a printed pattern, so it catches the light against the black."] },
          torso: { name:"Zip blazer", note:"Black single-breasted blazer with narrow lapels and a long, slim line.", facts:["A curved silver zipper cuts across the chest, a biker detail on formal tailoring.","Shown on a beach in Malibu, with Mick Jagger's 1975 Rolling Stones wardrobe as a reference."] },
          legs:  { name:"Flared trousers", note:"High-rise black trousers, straight to slightly flared, with a fluid, relaxed fit.", facts:["A much wider leg than the very narrow trousers of Hedi Slimane's era at the house."] },
          shoes: { name:"Pointed boots", note:"Black matte ankle boots with a pointed toe and a low heel.", facts:["Plain on purpose, so they don't compete with the shirt."] }
        },
        pins: {
          head:  { x:54, y:26, side:"r" },
          torso: { x:40, y:35, side:"l" },
          legs:  { x:46, y:64, side:"r" },
          shoes: { x:42, y:94, side:"r" }
        }
      }),
      look("Spring/Summer 2025 · Paris · Look 1", ["Striped shirt and tie","Beige jacket","Wide-leg trousers","Gold-tone shoes"], {
        photo: "images/saint-laurent-3.jpg",
        labels: { head:"Shirt" },
        pieces: {
          head:  { name:"Striped shirt and tie", note:"Striped button-down shirt with a diagonally striped navy-and-green necktie.", facts:["The tie is the one restrained touch of colour.","Dark oversized sunglasses finish the office-wear look."] },
          torso: { name:"Beige jacket", note:"Oversized beige jacket with padded shoulders, layered over a taupe double-breasted tailored blazer.", facts:["Two tailored jackets are layered, which exaggerates the shoulders and gives a boxy, power-suit silhouette.","Gold-tone cuff bracelets add a bold, jewellery-like finish."] },
          legs:  { name:"Wide-leg trousers", note:"Wide-leg tailored trousers in the same taupe as the blazer, with a fluid drape.", facts:["Anthony Vaccarello revisits Yves Saint Laurent’s habit of borrowing from traditionally masculine dress codes.","The collection was presented in Paris in September 2024."] },
          shoes: { name:"Gold-tone shoes", note:"Only a small glimpse of gold-tone footwear shows beneath the trousers." }
        },
        pins: {
          head:  { x:49, y:27, side:"r" },
          torso: { x:35, y:36, side:"l" },
          legs:  { x:48, y:68, side:"r" },
          shoes: { x:48, y:94, side:"l" }
        }
      })
    ]}
];

const pills = document.getElementById("pills");
const sheet = document.getElementById("sheet");
const card = document.getElementById("card");
const layout = document.getElementById("layout");
const detail = document.getElementById("detail");
const detailIn = document.getElementById("detailIn");
const frame = document.getElementById("frame");
const lookEl = document.getElementById("look");
const pinsEl = document.getElementById("pins");
const img = document.getElementById("img");
const guide = document.getElementById("guide");
const viewsEl = document.getElementById("views");
const showEl = document.getElementById("show");
const dots = document.getElementById("dots");
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let cur = 0, li = 0, vi = 0, pick = null, busy = false, swiped = false;

/* Designer pills */
DESIGNERS.forEach((d, i) => {
  const b = document.createElement("button");
  b.type = "button"; b.className = "pill"; b.setAttribute("role", "tab"); b.textContent = d.name;
  b.addEventListener("click", () => select(i));
  b.addEventListener("keydown", e => {
    const n = DESIGNERS.length;
    if (e.key === "ArrowRight") { select((cur + 1) % n, true); e.preventDefault(); }
    if (e.key === "ArrowLeft") { select((cur + n - 1) % n, true); e.preventDefault(); }
  });
  pills.appendChild(b);
});

function pattern(d) {
  const dim = d.dim == null ? .55 : d.dim;
  const shade = a => 'linear-gradient(rgba(10,10,12,' + a + '),rgba(10,10,12,' + a + '))';
  if (d.bg && d.bgFit) return shade(dim) + ', url("' + d.bg + '"), ' + shade(Math.max(dim, .7)) + ', url("' + d.bg + '")';
  if (d.bg) return shade(dim) + ', url("' + d.bg + '")';
  if (d.logo) return 'url("' + d.logo + '")';
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='170'><text x='150' y='92' text-anchor='middle' " +
    "font-family='Cormorant Garamond,Georgia,serif' font-style='italic' font-weight='500' font-size='30' fill='" + d.accent + "' fill-opacity='0.14' " +
    "transform='rotate(-12 150 85)'>" + d.wordmark + "</text></svg>";
  return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
}

/* Pick a designer: resets to their first look and rebuilds the overview */
function select(i, focus) {
  lookEl.getAnimations().forEach(a => a.cancel());
  busy = false; cur = i; li = 0; vi = 0; pick = null;
  const d = DESIGNERS[i];
  [...pills.children].forEach((t, n) => { t.setAttribute("aria-selected", n === i); t.tabIndex = n === i ? 0 : -1; });
  if (focus) pills.children[i].focus();
  document.documentElement.style.setProperty("--accent", d.accent);
  const photo = !!d.bg;
  document.body.classList.toggle("photo-bg", photo);
  document.body.style.backgroundImage = pattern(d);
  document.body.style.backgroundSize = !photo ? "" : d.bgFit ? "auto, auto 100%, auto, cover" : "cover";
  document.body.style.backgroundPosition = photo ? "center" : "";
  document.body.style.backgroundRepeat = photo ? "no-repeat" : "";
  card.style.backgroundImage = photo ? "none" : pattern(d);
  dots.innerHTML = d.looks.map((L, n) =>
    '<button type="button" class="dot-i" role="tab" data-i="' + n + '" aria-label="Runway ' + (n + 1) + ": " + L.show + '"></button>').join("");
  paintLook();
  sheet.innerHTML = '<div class="a"><h2>' + d.name + '</h2><p class="meta">' + d.meta + '</p><p class="lede">' + d.blurb + '</p></div>' +
    '<div class="b"><div class="facts"><p class="q">Did you know</p>' + d.facts.map(f => "<p>" + f + "</p>").join("") + "</div>" +
    '<p class="hint">Tap a dot on the look to explore each piece. Swipe for more runways.</p></div>';
  sheet.classList.remove("swap"); void sheet.offsetWidth; sheet.classList.add("swap");
  if (window.tick) window.tick(true);
}

/* Draw the current look and view: photo, callouts, toggle, label, dots and side panel */
function paintLook() {
  const d = DESIGNERS[cur], L = d.looks[li];
  const views = viewsOf(L), V = views[vi] || views[0];
  img.hidden = !V.photo; guide.style.display = V.photo ? "none" : "";
  if (V.photo) {
    img.src = V.photo;
    img.alt = d.name + ", runway " + (li + 1) + (views.length > 1 ? ", " + V.name.toLowerCase() + " view" : "");
  }
  zoomImg(img, V);
  pinsEl.innerHTML = pinsHTML(L, V, frame.clientWidth || 380, true);
  viewsEl.hidden = views.length < 2;
  viewsEl.innerHTML = views.length < 2 ? "" : views.map((v, n) =>
    '<button type="button" class="view" data-n="' + n + '" aria-pressed="' + (n === vi) + '">' + v.name + "</button>").join("");
  showEl.textContent = L.show;
  [...dots.children].forEach((b, n) => b.setAttribute("aria-selected", n === li));
  render();
}

/* Switch between the photos of the current look (front, back, ...) */
function setView(n) {
  if (n === vi || busy) return;
  vi = n; paintLook();
  if (!calm) lookEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: "ease-out" });
}

/* Slide to another look. An open piece stays open and updates to the new look */
function showLook(idx, dir) {
  const n = DESIGNERS[cur].looks.length;
  idx = (idx + n) % n;
  if (idx === li || busy) return;
  dir = dir || (idx > li ? 1 : -1);
  if (calm) { li = idx; vi = 0; paintLook(); return; }
  busy = true;
  const out = lookEl.animate(
    [{ transform: "translateX(0)", opacity: 1 }, { transform: "translateX(" + (-dir * 48) + "px)", opacity: 0 }],
    { duration: 160, easing: "ease-in", fill: "forwards" });
  out.onfinish = () => {
    li = idx; vi = 0; paintLook();
    const inn = lookEl.animate(
      [{ transform: "translateX(" + (dir * 48) + "px)", opacity: 0 }, { transform: "none", opacity: 1 }],
      { duration: 280, easing: "cubic-bezier(.2,.7,.2,1)" });
    out.cancel();
    inn.onfinish = () => { busy = false; };
  };
}

function setPick(k) { pick = pick === k ? null : k; render(); }

/* Highlight the picked piece and fill the panel to the right of the photo */
function render() {
  const L = DESIGNERS[cur].looks[li];
  pinsEl.querySelectorAll(".pin").forEach(p => p.setAttribute("aria-pressed", p.dataset.k === pick));
  guide.querySelectorAll("[data-k]").forEach(g => g.classList.toggle("on", g.dataset.k === pick));
  layout.dataset.pick = pick ? "true" : "false";
  detail.dataset.open = pick ? "true" : "false";
  detail.setAttribute("aria-hidden", pick ? "false" : "true");
  if (pick) {
    const p = L.pieces[pick];
    detailIn.innerHTML = "<small>" + lab(L, pick) + "</small><strong>" + p.name + "</strong><p>" + p.note + "</p>" +
      (p.facts ? "<ul>" + p.facts.map(f => "<li>" + f + "</li>").join("") + "</ul>" : "") +
      '<button type="button" id="clear">Close</button>';
    document.getElementById("clear").addEventListener("click", () => setPick(pick));
  }
}

pinsEl.addEventListener("click", e => {
  if (swiped) return;
  const p = e.target.closest(".pin"); if (p) setPick(p.dataset.k);
});

/* Look controls: arrows, dots, front/back toggle, swipe and keyboard */
document.querySelectorAll(".step").forEach(b => b.addEventListener("click", () => {
  const s = Number(b.dataset.s); showLook(li + s, s);
}));
dots.addEventListener("click", e => { const b = e.target.closest(".dot-i"); if (b) showLook(Number(b.dataset.i)); });
viewsEl.addEventListener("click", e => { const b = e.target.closest(".view"); if (b) setView(Number(b.dataset.n)); });

let sx = 0, sy = 0, tracking = false;
frame.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; tracking = true; });
frame.addEventListener("pointercancel", () => { tracking = false; });
frame.addEventListener("pointerup", e => {
  if (!tracking) return;
  tracking = false;
  const dx = e.clientX - sx, dy = e.clientY - sy;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    swiped = true; setTimeout(() => { swiped = false; }, 60);
    showLook(li + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  }
});

document.addEventListener("keydown", e => {
  if (e.target && /^(SELECT|INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
  if (e.key === "Escape" && pick) setPick(pick);
  if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && !e.defaultPrevented) {
    const s = e.key === "ArrowRight" ? 1 : -1; showLook(li + s, s);
  }
});

/* Info position toggle */
document.querySelectorAll("[data-v]").forEach(b => b.addEventListener("click", () => {
  layout.dataset.info = b.dataset.v;
  document.querySelectorAll("[data-v]").forEach(x => x.setAttribute("aria-pressed", x === b));
}));

/* Slim "Did you know" ticker. Builds its own markup and styles, so no other file needs editing. */
(function () {
  document.querySelectorAll(".dyk").forEach(n => n.remove());

  const st = document.createElement("style");
  st.textContent = `
.dyk{position:relative;display:flex;align-items:baseline;gap:18px;margin:0 0 18px;padding:2px 0 14px;cursor:pointer;outline:none;color:var(--ink);-webkit-tap-highlight-color:transparent}
.dyk::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:color-mix(in srgb,var(--ink) 14%,transparent)}
.dyk-q{flex:none;display:flex;align-items:center;gap:10px;font-size:10.5px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);transition:color .25s}
.dyk-q::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--accent)}
.dyk-t{flex:1;min-width:0;font-family:var(--serif);font-style:italic;font-weight:500;font-size:clamp(18px,1.6vw,21px);line-height:1.3;opacity:0;transform:translateY(5px);transition:opacity .4s ease,transform .4s ease}
.dyk-t.on{opacity:1;transform:none}
.dyk-n{flex:none;font-size:11px;letter-spacing:.12em;color:var(--muted);font-variant-numeric:tabular-nums}
.dyk-bar{position:absolute;left:0;bottom:0;width:100%;height:1px;background:linear-gradient(90deg,var(--accent),transparent);transform:scaleX(0);transform-origin:left;pointer-events:none}
.dyk-bar.run{animation:dykRun 6.5s linear forwards}
@keyframes dykRun{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.dyk.hold .dyk-bar{animation-play-state:paused}
.dyk:hover .dyk-q{color:var(--ink)}
.dyk:focus-visible{outline:2px solid var(--ink);outline-offset:6px;border-radius:4px}
body.photo-bg .dyk{--ink:#f5f5f7;--muted:#c9c9ce}
@media (max-width:560px){.dyk{flex-wrap:wrap;gap:6px 14px}.dyk-t{flex:1 1 100%;order:3}.dyk-n{margin-left:auto}}
`;
  document.head.appendChild(st);

  const el = document.createElement("div");
  el.className = "dyk"; el.tabIndex = 0; el.setAttribute("role", "group");
  el.setAttribute("aria-label", "Did you know. Press Enter for the next fact.");
  el.innerHTML = '<span class="dyk-q">Did you know</span><span class="dyk-t"></span><span class="dyk-n"></span><i class="dyk-bar"></i>';
  const toolbar = document.querySelector(".toolbar");
  toolbar.parentNode.insertBefore(el, toolbar);

  const txt = el.querySelector(".dyk-t"), num = el.querySelector(".dyk-n"), bar = el.querySelector(".dyk-bar");
  let i = 0, t;

  function show(reset) {
    const f = DESIGNERS[cur].facts;
    i = reset ? 0 : (i + 1) % f.length;
    txt.classList.remove("on"); clearTimeout(t);
    t = setTimeout(() => {
      txt.textContent = f[i];
      num.textContent = String(i + 1).padStart(2, "0") + " / " + String(f.length).padStart(2, "0");
      txt.classList.add("on");
    }, reset || calm ? 0 : 280);
    bar.classList.remove("run"); void bar.offsetWidth; bar.classList.add("run");
  }
  window.tick = show;

  /* the progress line drives the rotation, so hovering pauses both together */
  if (calm) setInterval(() => { if (!document.hidden && !el.classList.contains("hold")) show(); }, 6500);
  else bar.addEventListener("animationend", () => { if (!document.hidden) show(); });

  el.addEventListener("mouseenter", () => el.classList.add("hold"));
  el.addEventListener("mouseleave", () => el.classList.remove("hold"));
  el.addEventListener("focus", () => el.classList.add("hold"));
  el.addEventListener("blur", () => el.classList.remove("hold"));
  el.addEventListener("click", () => show());
  el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(); } });
  show(true);
})();

/* ------------------------------------------------------------------
   UNIFIED COMPARE CONTROLLER: Toggles dual side-by-side cards inside the main card container
------------------------------------------------------------------- */
(function initInPageCompare() {
  const cmpNavBtn = document.getElementById("cmpNavBtn");
  const layout = document.getElementById("layout");
  const cmpDualCard = document.getElementById("cmpDualCard");

  if (!cmpNavBtn || !layout || !cmpDualCard) return;

  let isComparing = false;

  const allLooks = [];
  DESIGNERS.forEach((d, dIdx) => {
    d.looks.forEach((L, lIdx) => {
      allLooks.push({
        id: `${dIdx}-${lIdx}`,
        designerIdx: dIdx,
        lookIdx: lIdx,
        label: `${d.name} — ${L.show}`
      });
    });
  });

  function CardController(prefix, defaultIdx) {
    this.currentLookGlobalIdx = defaultIdx;
    this.viewIdx = 0;

    this.selectEl = document.getElementById("select" + prefix);
    this.imgEl = document.getElementById("img" + prefix);
    this.pinsEl = document.getElementById("pins" + prefix);
    this.viewsEl = document.getElementById("views" + prefix);
    this.showEl = document.getElementById("show" + prefix);
    this.dotsEl = document.getElementById("dots" + prefix);
    this.prevBtn = document.getElementById("prev" + prefix);
    this.nextBtn = document.getElementById("next" + prefix);

    this.selectEl.innerHTML = allLooks.map(item =>
      `<option value="${item.id}">${item.label}</option>`
    ).join("");
    this.selectEl.value = allLooks[defaultIdx].id;

    this.selectEl.addEventListener("change", e => {
      const idx = allLooks.findIndex(x => x.id === e.target.value);
      if (idx !== -1) {
        this.currentLookGlobalIdx = idx;
        this.viewIdx = 0;
        this.render();
      }
    });

    this.prevBtn.addEventListener("click", () => {
      const total = allLooks.length;
      this.currentLookGlobalIdx = (this.currentLookGlobalIdx + total - 1) % total;
      this.viewIdx = 0;
      this.selectEl.value = allLooks[this.currentLookGlobalIdx].id;
      this.render();
    });

    this.nextBtn.addEventListener("click", () => {
      const total = allLooks.length;
      this.currentLookGlobalIdx = (this.currentLookGlobalIdx + 1) % total;
      this.viewIdx = 0;
      this.selectEl.value = allLooks[this.currentLookGlobalIdx].id;
      this.render();
    });

    this.viewsEl.addEventListener("click", e => {
      const b = e.target.closest(".view");
      if (b) {
        this.viewIdx = Number(b.dataset.n);
        this.render();
      }
    });

    this.render = function() {
      const item = allLooks[this.currentLookGlobalIdx];
      const d = DESIGNERS[item.designerIdx];
      const L = d.looks[item.lookIdx];
      const views = viewsOf(L);
      const V = views[this.viewIdx] || views[0];

      this.imgEl.hidden = !V.photo;
      if (V.photo) this.imgEl.src = V.photo;
      this.imgEl.alt = `${d.name}, ${L.show}`;
      zoomImg(this.imgEl, V);
      const fr = this.imgEl.closest(".frame");
      this.pinsEl.innerHTML = pinsHTML(L, V, (fr && fr.clientWidth) || 340, false);

      this.viewsEl.hidden = views.length < 2;
      this.viewsEl.innerHTML = views.length < 2 ? "" : views.map((v, n) =>
        `<button type="button" class="view" data-n="${n}" aria-pressed="${n === this.viewIdx}">${v.name}</button>`
      ).join("");

      this.showEl.textContent = `${d.name} · ${L.show}`;

      this.dotsEl.innerHTML = allLooks.map((lk, n) =>
        `<button type="button" class="dot-i" role="tab" data-gidx="${n}" aria-selected="${n === this.currentLookGlobalIdx}" onclick="window.setLook${prefix}(${n})"></button>`
      ).join("");
    };

    window['setLook' + prefix] = (n) => {
      this.currentLookGlobalIdx = n;
      this.viewIdx = 0;
      this.selectEl.value = allLooks[n].id;
      this.render();
    };

    this.render();
  }

  const cardA = new CardController("A", 0);
  const cardB = new CardController("B", Math.min(1, allLooks.length - 1));

  document.getElementById("pills").addEventListener("click", () => { if (isComparing) cmpNavBtn.click(); });

  cmpNavBtn.addEventListener("click", () => {
    isComparing = !isComparing;
    cmpNavBtn.setAttribute("aria-pressed", isComparing);
    layout.classList.toggle("comparing", isComparing);
    document.body.classList.toggle("comparing", isComparing);
    cmpDualCard.hidden = !isComparing;
    if (isComparing) {
      cardA.render();
      cardB.render();
    }
  });
})();

/* Newsletter: subscription details first, then email and consent, then a confirmation.
   Nothing is charged here. Set NEWSLETTER.endpoint (for example a Formspree URL) to actually receive emails. */
const NEWSLETTER = {
  price: "$49.50 / month",   /* change here to update every mention of the price */
  endpoint: ""           /* leave empty for preview mode, where nothing is sent or stored */
};
(function () {
  const btn = document.getElementById("nlNavBtn"); if (!btn) return;
  const D = document;

  const st = D.createElement("style");
  st.textContent = `
.nl{position:fixed;inset:0;z-index:30;display:grid;place-items:center;padding:calc(env(safe-area-inset-top,0px) + 16px) 16px calc(env(safe-area-inset-bottom,0px) + 16px);background:color-mix(in srgb,var(--bg) 62%,transparent);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);opacity:0;transition:opacity .3s}
.nl[hidden]{display:none}
.nl.show{opacity:1}
.nl-card{position:relative;width:min(480px,100%);max-height:100%;overflow:auto;padding:40px clamp(22px,5vw,40px) 32px;border-radius:26px;background:color-mix(in srgb,var(--solid) 88%,transparent);border:1px solid var(--edge);box-shadow:var(--shadow);color:var(--ink);transform:translateY(10px);transition:transform .35s cubic-bezier(.2,.7,.2,1)}
.nl.show .nl-card{transform:none}
.nl-step[hidden]{display:none}
.nl-x{all:unset;cursor:pointer;position:absolute;top:16px;right:22px;font-size:13px;font-weight:600;color:var(--muted)}
.nl-x:hover{color:var(--ink);text-decoration:underline;text-underline-offset:4px}
.nl-eyebrow{margin:0 0 14px;display:flex;align-items:center;gap:10px;font-size:10.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
.nl-eyebrow::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--accent)}
.nl-title{margin:0 0 14px;font-family:var(--serif);font-weight:400;font-size:clamp(30px,5vw,40px);line-height:1.04;letter-spacing:-.01em;outline:none}
.nl-lede{margin:0 0 22px;color:var(--muted);font-size:15px;line-height:1.55}
.nl-meta{margin:0 0 26px;display:grid}
.nl-meta div{display:grid;grid-template-columns:92px 1fr;gap:14px;padding:12px 0;border-top:1px solid color-mix(in srgb,var(--ink) 12%,transparent);font-size:14px;line-height:1.5}
.nl-meta div:last-child{border-bottom:1px solid color-mix(in srgb,var(--ink) 12%,transparent)}
.nl-meta dt{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);padding-top:2px}
.nl-meta dd{margin:0}
.nl-btn{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:12px 28px;border-radius:999px;font-size:14px;font-weight:600;background:var(--ink);color:var(--solid);transition:transform .2s,box-shadow .25s,opacity .2s}
.nl-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px color-mix(in srgb,var(--accent) 45%,transparent)}
.nl-btn:disabled{opacity:.55;cursor:default;transform:none;box-shadow:none}
.nl-link{all:unset;cursor:pointer;font-size:14px;font-weight:600;color:var(--muted)}
.nl-link:hover{color:var(--ink);text-decoration:underline;text-underline-offset:4px}
.nl-btn:focus-visible,.nl-link:focus-visible,.nl-x:focus-visible{outline:2px solid var(--ink);outline-offset:3px;border-radius:999px}
.nl-label{display:block;margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.nl-input{box-sizing:border-box;width:100%;padding:13px 16px;border-radius:14px;border:1px solid var(--faint);background:var(--tint);color:var(--ink);font:inherit;font-size:16px;outline:none;transition:border-color .2s,box-shadow .2s}
.nl-input:focus{border-color:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 22%,transparent)}
.nl-check{display:flex;gap:12px;align-items:flex-start;margin:16px 0 0;font-size:14px;line-height:1.5;cursor:pointer}
.nl-check input{flex:none;width:18px;height:18px;margin:2px 0 0;accent-color:var(--accent);cursor:pointer}
.nl-err{min-height:1.4em;margin:14px 0 6px;font-size:13px;color:#d4503f}
.nl-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:10px}
.nl-note{margin:0 0 22px;font-size:12.5px;color:var(--muted)}
.nl-note:empty{display:none}
`;
  D.head.appendChild(st);

  const el = D.createElement("div");
  el.className = "nl"; el.id = "nl"; el.hidden = true;
  el.innerHTML = `
<div class="nl-card" role="dialog" aria-modal="true" aria-labelledby="nlTitle1">
  <button class="nl-x" type="button" data-close>Close</button>

  <section class="nl-step" data-step="details">
    <p class="nl-eyebrow">The Line · Newsletter</p>
    <h2 class="nl-title" id="nlTitle1" tabindex="-1">First access to the pieces on this site</h2>
    <p class="nl-lede">Subscribers get to the clothes featured on The Line before everyone who isn’t on the newsletter.</p>
    <dl class="nl-meta">
      <div><dt>Includes</dt><dd>Early access to the featured pieces, ahead of non-subscribers, plus a short note when something new is coming.</dd></div>
      <div><dt>Price</dt><dd>${NEWSLETTER.price}</dd></div>
      <div><dt>Payment</dt><dd>Nothing is charged today. We’ll email you to arrange payment.</dd></div>
      <div><dt>Cancel</dt><dd>Any time, by replying to any email we send.</dd></div>
    </dl>
    <button class="nl-btn" type="button" data-go="form">Continue</button>
  </section>

  <form class="nl-step" data-step="form" novalidate hidden>
    <p class="nl-eyebrow">Step 2 of 2</p>
    <h2 class="nl-title" tabindex="-1">Where should we reach you?</h2>
    <p class="nl-lede">Enter your email and confirm below to join.</p>
    <label class="nl-label" for="nlEmail">Email address</label>
    <input class="nl-input" id="nlEmail" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com">
    <label class="nl-check"><input type="checkbox" id="nlC1"><span>I agree to receive The Line newsletter by email.</span></label>
    <label class="nl-check"><input type="checkbox" id="nlC2"><span>I agree to pay the subscription fee (${NEWSLETTER.price}). I won’t be charged until I’m contacted to complete payment.</span></label>
    <p class="nl-err" id="nlErr" role="alert"></p>
    <div class="nl-row"><button class="nl-link" type="button" data-go="details">Back</button><button class="nl-btn" type="submit" id="nlSubmit">Subscribe</button></div>
  </form>

  <section class="nl-step" data-step="done" hidden>
    <p class="nl-eyebrow">Confirmed</p>
    <h2 class="nl-title" tabindex="-1">You’re on the list</h2>
    <p class="nl-lede">We’ll reach out to <strong id="nlSent"></strong> to complete your subscription and payment. Check your inbox, and your spam folder just in case.</p>
    <p class="nl-note" id="nlNote"></p>
    <button class="nl-btn" type="button" data-close>Done</button>
  </section>
</div>`;
  D.body.appendChild(el);

  const $ = s => el.querySelector(s);
  const steps = [...el.querySelectorAll(".nl-step")];
  const form = $("form"), email = $("#nlEmail"), c1 = $("#nlC1"), c2 = $("#nlC2"), err = $("#nlErr"), go1 = $("#nlSubmit");

  function go(name) {
    steps.forEach(s => { s.hidden = s.dataset.step !== name; });
    const s = steps.find(x => x.dataset.step === name);
    const target = name === "form" ? email : s.querySelector(".nl-title");
    setTimeout(() => target && target.focus(), 30);
  }
  function open() {
    form.reset(); err.textContent = ""; go("details");
    el.hidden = false; D.body.style.overflow = "hidden";
    requestAnimationFrame(() => el.classList.add("show"));
  }
  function close() {
    el.classList.remove("show"); D.body.style.overflow = "";
    setTimeout(() => { el.hidden = true; }, 260);
    btn.focus();
  }
  function fail(msg, focusEl) { err.textContent = msg; if (focusEl) focusEl.focus(); }

  btn.addEventListener("click", open);
  el.addEventListener("click", e => {
    if (e.target === el || e.target.closest("[data-close]")) return close();
    const g = e.target.closest("[data-go]"); if (g) go(g.dataset.go);
  });
  el.addEventListener("keydown", e => {
    e.stopPropagation();
    if (e.key === "Escape") return close();
    if (e.key !== "Tab") return;
    const f = [...el.querySelectorAll("button,input")].filter(n => !n.disabled && !n.closest("[hidden]"));
    if (!f.length) return;
    const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && D.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && D.activeElement === z) { e.preventDefault(); a.focus(); }
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const addr = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(addr)) return fail("Please enter a valid email address.", email);
    if (!c1.checked || !c2.checked) return fail("Please tick both boxes to continue.", c1.checked ? c2 : c1);
    err.textContent = ""; go1.disabled = true; go1.textContent = "Sending…";
    try {
      if (NEWSLETTER.endpoint) {
        const r = await fetch(NEWSLETTER.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ email: addr, newsletter: true, payment_agreed: true, price: NEWSLETTER.price, source: "The Line" })
        });
        if (!r.ok) throw new Error("bad response");
      }
      $("#nlSent").textContent = addr;
      $("#nlNote").textContent = NEWSLETTER.endpoint ? "" : "Preview mode: this email has not been stored or sent anywhere.";
      go("done");
    } catch (_) {
      fail("Something went wrong, so nothing was sent. Please try again.");
    } finally {
      go1.disabled = false; go1.textContent = "Subscribe";
    }
  });
})();

select(0);