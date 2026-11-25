"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  product: string;
  brand: string;
  gender: string;
  season: string;
  price: number;
  offerPrice3Units?: number;
  image: string;
  description: string;
};

const PRODUCTS: Product[] = [
  {
    id: "1",
    product: "SNOW FLOWER EDT 30 ML TESTER",
    brand: "SWISS ARMY VICTORINOX",
    gender: "Mujer",
    season: "Primavera",
    price: 8900,
    offerPrice3Units: 6000,
    image: "",
    description: "Fragancia fresca y delicada.",
  },
  {
    id: "2",
    product: "BUTTER SCOTCH EDP 100 ML",
    brand: "ADYAN",
    gender: "Unisex",
    season: "Invierno",
    price: 23400,
    offerPrice3Units: 20700,
    image: "",
    description: "Una fragancia dulce y envolvente.",
  },
  {
    id: "3",
    product: "BELLA NIGHT EDP 100 ML",
    brand: "OSCAR DE LA RENTA",
    gender: "Mujer",
    season: "Noche",
    price: 35640,
    offerPrice3Units: 32000,
    image: "",
    description: "Elegante fragancia para ocasiones especiales.",
  },
  {
    id: "4",
    product: "BLOOD LILY EDP 100 ML",
    brand: "ADYAN",
    gender: "Unisex",
    season: "Verano",
    price: 23400,
    offerPrice3Units: 20700,
    image: "",
    description: "Una fragancia intensa y sofisticada.",
  },
];

const WHATSAPP_NUMBER = "56983481007";
const CART_KEY = "vs_sanantonio-cart";

const money = (value: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);

export default function Home() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartLoaded, setCartLoaded] = useState(false);

  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("all");
  const [gender, setGender] = useState("all");
  const [season, setSeason] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [details, setDetails] = useState<string[]>([]);

  // Restore saved cart
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {
      setCart({});
    } finally {
      setCartLoaded(true);
    }
  }, []);

  // Save cart only after restoration
  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, cartLoaded]);

  const totalUnits = Object.values(cart).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const promoActive = totalUnits >= 3;

  const lines = PRODUCTS
    .filter((product) => (cart[product.id] ?? 0) > 0)
    .map((product) => ({
      product,
      qty: cart[product.id],
    }));

  const totalNormal = lines.reduce(
    (sum, line) => sum + line.product.price * line.qty,
    0
  );

  const totalPromo = lines.reduce(
    (sum, line) =>
      sum +
      (promoActive
        ? line.product.offerPrice3Units ?? line.product.price
        : line.product.price) *
      line.qty,
    0
  );

  const savings = totalNormal - totalPromo;

  const brands = useMemo(
    () => [...new Set(PRODUCTS.map((p) => p.brand))].sort(),
    []
  );

  const genders = useMemo(
    () => [...new Set(PRODUCTS.map((p) => p.gender))].sort(),
    []
  );

  const filteredProducts = PRODUCTS.filter((product) => {
    const term = query.toLowerCase().trim();

    return (
      (!term ||
        product.product.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term)) &&
      (brand === "all" || product.brand === brand) &&
      (gender === "all" || product.gender === gender) &&
      (season === "all" || product.season === season)
    );
  });

  function setQuantity(id: string, quantity: number) {
    setCart((previous) => {
      const next = { ...previous };

      if (quantity <= 0) {
        delete next[id];
      } else {
        next[id] = quantity;
      }

      return next;
    });
  }

  function addOne(id: string) {
    setQuantity(id, (cart[id] ?? 0) + 1);
  }

  function toggleDetails(id: string) {
    setDetails((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  function sendWhatsAppOrder() {
    if (!lines.length) return;

    const rows = lines.map((line) => {
      const unitPrice = promoActive
        ? line.product.offerPrice3Units ?? line.product.price
        : line.product.price;

      return `${line.qty} x ${line.product.product} (${money(unitPrice)} c/u)`;
    });

    const message = [
      "Hola, quiero hacer este pedido:",
      "",
      ...rows,
      "",
      `Total: ${money(totalPromo)}`,
      ...(promoActive
        ? [
          `Total normal: ${money(totalNormal)}`,
          `Ahorras ${money(savings)} con Promo 3+`,
        ]
        : []),
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#25221d]">

      {/* HEADER */}
      <header className="relative overflow-hidden bg-[#171613] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(177,143,82,0.16),transparent_65%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-8 md:py-12">

          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <div className="text-2xl font-serif tracking-[0.25em] text-[#d6b77b] md:text-3xl">
                VS San Antonio
              </div>
              <p className="mt-1 text-[9px] tracking-[0.42em] text-white/60">
                PERFUMERÍA & ACCESORIOS
              </p>
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 rounded-full border border-[#b89b65]/50 px-4 py-2 text-sm transition hover:bg-[#b89b65]/15"
            >
              <span>♧</span>
              <span className="hidden sm:inline">Mi pedido</span>
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#b89b65] px-1 text-xs font-bold text-black">
                {totalUnits}
              </span>
            </button>
          </div>

          <div className="mx-auto max-w-3xl py-12 text-center md:py-16">
            <p className="mb-4 text-xs tracking-[0.35em] text-[#d6b77b]">
              DESCUBRE TU ESENCIA
            </p>

            <h1 className="font-serif text-4xl leading-tight md:text-6xl">
              El perfume perfecto
              <span className="block italic text-[#d6b77b]">
                habla por ti.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/60 md:text-base">
              Encuentra fragancias únicas para cada momento y ocasión.
              Descubre tu próxima favorita.
            </p>

            <a
              href="#catalogo"
              className="mt-8 inline-flex items-center border border-[#b89b65] px-8 py-3 text-xs font-semibold tracking-[0.2em] text-[#e2c48c] transition hover:bg-[#b89b65] hover:text-black"
            >
              EXPLORAR CATÁLOGO
            </a>
          </div>
        </div>
      </header>

      {/* PROMOTION */}
      <section className="bg-[#b89b65] px-5 py-10 text-center text-[#171613]">
        <p className="text-[10px] font-bold tracking-[0.35em]">
          ✦ OFERTAS ESPECIALES ✦
        </p>

        <h2 className="mt-2 font-serif text-4xl font-bold tracking-wider md:text-5xl">
          BLACK WEEK
        </h2>

        <p className="mt-3 text-sm font-medium">
          Adelanta tus regalos de Navidad
        </p>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-black/70">
          Elige 3 o más perfumes, combina tus favoritos y aprovecha
          precios especiales en cada uno.
        </p>

        <div className="mx-auto mt-5 inline-block border border-black/30 px-5 py-2 text-xs font-bold tracking-widest">
          LLEVA 3 O MÁS Y AHORRA EN CADA UNO
        </div>

        {promoActive && (
          <p className="mt-4 text-sm font-bold">
            ¡Tu promoción está activa! Ya llevas {totalUnits} productos.
          </p>
        )}
      </section>

      {/* CATALOG */}
      <section
        id="catalogo"
        className="mx-auto max-w-7xl px-5 py-14 md:py-20"
      >
        <div className="mb-10 text-center">
          <p className="text-[10px] font-bold tracking-[0.35em] text-[#a48750]">
            NUESTRA SELECCIÓN
          </p>

          <h2 className="mt-3 font-serif text-3xl md:text-4xl">
            Catálogo de perfumes
          </h2>

          <div className="mx-auto mt-4 h-px w-16 bg-[#b89b65]" />

          <p className="mt-4 text-sm text-gray-500">
            Encuentra la fragancia ideal para ti.
          </p>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="mb-10 rounded-xl border border-[#e8e1d3] bg-white p-5 shadow-sm md:p-7">
          <label
            htmlFor="search"
            className="mb-2 block text-xs font-bold tracking-widest text-gray-600"
          >
            BUSCAR PRODUCTOS
          </label>

          <div className="flex items-center border border-[#e5dfd2] bg-[#faf9f6] px-4 transition focus-within:border-[#b89b65]">
            <span className="text-xl text-[#a48750]">⌕</span>
            <input
              id="search"
              type="search"
              placeholder="Buscar por nombre o marca..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 w-full bg-transparent px-3 text-sm outline-none placeholder:text-gray-400"
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-gray-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="h-11 border border-[#e5dfd2] bg-[#faf9f6] px-3 text-sm outline-none focus:border-[#b89b65]"
            >
              <option value="all">Todas las marcas</option>
              {brands.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="h-11 border border-[#e5dfd2] bg-[#faf9f6] px-3 text-sm outline-none focus:border-[#b89b65]"
            >
              <option value="all">Todos los géneros</option>
              {genders.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="h-11 border border-[#e5dfd2] bg-[#faf9f6] px-3 text-sm outline-none focus:border-[#b89b65]"
            >
              <option value="all">Todas las temporadas</option>
              {["Primavera", "Verano", "Otoño", "Invierno", "Noche"].map(
                (item) => (
                  <option key={item} value={item}>{item}</option>
                )
              )}
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>{filteredProducts.length} productos encontrados</span>
            <button
              onClick={() => {
                setQuery("");
                setBrand("all");
                setGender("all");
                setSeason("all");
              }}
              className="font-semibold text-[#987a42] hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const quantity = cart[product.id] ?? 0;
            const hasOffer = Boolean(product.offerPrice3Units);
            const displayPrice =
              promoActive && hasOffer
                ? product.offerPrice3Units!
                : product.price;

            return (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden border border-[#e9e2d6] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#c4a66d] hover:shadow-xl"
              >
                {/* IMAGE */}
                <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#f1eee8] p-5">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.product}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-[#b5a98f]">
                      <span className="font-serif text-5xl">SA</span>
                      <span className="mt-2 text-[9px] tracking-[0.3em]">
                        PERFUMERÍA
                      </span>
                    </div>
                  )}

                  {hasOffer && (
                    <span className="absolute left-3 top-3 bg-[#b89b65] px-3 py-1 text-[9px] font-bold tracking-widest text-black">
                      BLACK WEEK
                    </span>
                  )}

                  <span className="absolute bottom-3 right-3 bg-white/90 px-3 py-1 text-[10px] text-gray-600">
                    {product.gender}
                  </span>
                </div>

                {/* PRODUCT INFO */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-[#a48750]">
                    {product.brand}
                  </p>

                  <h3 className="mt-2 min-h-12 text-sm font-semibold leading-6 text-[#25221d]">
                    {product.product || "Nombre del producto pendiente"}
                  </h3>

                  <div className="mt-4 border-t border-[#eee9df] pt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Precio normal</span>
                      <span className={promoActive && hasOffer ? "line-through" : "font-semibold text-gray-800"}>
                        {money(product.price)}
                      </span>
                    </div>

                    {hasOffer && (
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#a48750]">
                          PRECIO 3+
                        </span>
                        <span className="text-lg font-bold text-[#8b6b30]">
                          {money(product.offerPrice3Units!)}
                        </span>
                      </div>
                    )}

                    {hasOffer && (
                      <p className="mt-1 text-right text-[10px] text-gray-400">
                        {promoActive
                          ? "Promoción aplicada"
                          : "Precio especial llevando 3+"}
                      </p>
                    )}

                    {!hasOffer && (
                      <p className="mt-3 text-lg font-bold">
                        {money(displayPrice)}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-5">
                    {quantity > 0 ? (
                      <div className="flex items-center justify-between border border-[#d9c9a7] bg-[#faf8f3] px-3 py-2">
                        <span className="text-xs font-semibold">Cantidad</span>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setQuantity(product.id, quantity - 1)}
                            className="text-lg text-[#987a42] hover:text-black"
                          >
                            −
                          </button>

                          <span className="min-w-4 text-center text-sm font-bold">
                            {quantity}
                          </span>

                          <button
                            onClick={() => addOne(product.id)}
                            className="text-lg text-[#987a42] hover:text-black"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => addOne(product.id)}
                        className="w-full bg-[#1c1b18] px-4 py-3 text-[10px] font-bold tracking-[0.18em] text-white transition hover:bg-[#a48750]"
                      >
                        AGREGAR AL PEDIDO
                      </button>
                    )}

                    <button
                      onClick={() => toggleDetails(product.id)}
                      className="mt-4 w-full text-center text-xs text-gray-500 hover:text-[#987a42]"
                    >
                      {details.includes(product.id)
                        ? "− Ocultar detalles"
                        : "+ Ver detalles"}
                    </button>

                    {details.includes(product.id) && (
                      <p className="mt-3 border-t border-[#eee9df] pt-3 text-xs leading-6 text-gray-500">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="border border-dashed border-[#d8cbb3] bg-white px-5 py-16 text-center">
            <p className="font-serif text-2xl">No encontramos productos</p>
            <p className="mt-2 text-sm text-gray-500">
              Prueba con otro nombre o modifica los filtros.
            </p>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="bg-[#171613] px-5 py-10 text-center text-white">
        <h2 className="font-serif text-2xl tracking-[0.2em] text-[#d6b77b]">
          VS San Antonio
        </h2>
        <p className="mt-2 text-[9px] tracking-[0.35em] text-white/50">
          PERFUMERÍA & ACCESORIOS
        </p>
        <div className="mx-auto my-6 h-px w-12 bg-[#b89b65]" />
        <p className="text-xs text-white/50">
          Encuentra tu esencia. Define tu estilo.
        </p>
      </footer>

      {/* FLOATING CART BUTTON */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#b89b65] text-2xl text-black shadow-xl transition hover:scale-105 hover:bg-[#d2b77e]"
        aria-label="Abrir pedido"
      >
        🛍
        {totalUnits > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#171613] px-1 text-xs font-bold text-white">
            {totalUnits}
          </span>
        )}
      </button>

      {/* CART DRAWER */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60"
          onClick={() => setCartOpen(false)}
        >
          <section
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#faf9f6] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e7dfd0] bg-[#171613] px-6 py-6 text-white">
              <div>
                <p className="text-[9px] tracking-[0.3em] text-[#d6b77b]">
                  SA San Antonio
                </p>
                <h2 className="mt-1 font-serif text-2xl">Mi pedido</h2>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="text-xl text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {lines.length === 0 ? (
                <div className="py-20 text-center">
                  <span className="text-4xl">🛍</span>
                  <p className="mt-4 font-serif text-xl">
                    Tu pedido está vacío
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Agrega tus perfumes favoritos para continuar.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-6 bg-[#171613] px-6 py-3 text-xs font-bold tracking-widest text-white"
                  >
                    VER CATÁLOGO
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {lines.map(({ product, qty }) => {
                    const unitPrice = promoActive
                      ? product.offerPrice3Units ?? product.price
                      : product.price;

                    return (
                      <div
                        key={product.id}
                        className="border-b border-[#e8e1d3] pb-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold tracking-widest text-[#a48750]">
                              {product.brand}
                            </p>
                            <h3 className="mt-1 text-sm font-semibold">
                              {product.product || "Producto"}
                            </h3>
                            <p className="mt-2 text-sm font-bold">
                              {money(unitPrice)} c/u
                            </p>
                          </div>

                          <button
                            onClick={() => setQuantity(product.id, 0)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Quitar
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-4 border border-[#e1d7c5] bg-white px-3 py-1">
                            <button
                              onClick={() => setQuantity(product.id, qty - 1)}
                              className="text-lg text-[#987a42]"
                            >
                              −
                            </button>
                            <span className="text-sm font-bold">{qty}</span>
                            <button
                              onClick={() => addOne(product.id)}
                              className="text-lg text-[#987a42]"
                            >
                              +
                            </button>
                          </div>

                          <strong className="text-sm">
                            {money(unitPrice * qty)}
                          </strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-[#e7dfd0] bg-white p-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Unidades</span>
                  <span>{totalUnits}</span>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span>Total normal</span>
                  <span className={promoActive ? "line-through text-gray-400" : "font-semibold"}>
                    {money(totalNormal)}
                  </span>
                </div>

                {promoActive && (
                  <div className="mt-3 bg-[#f5f0e5] p-3 text-xs text-[#80652f]">
                    ¡Felicidades! Ahorras {money(savings)} con la promoción de 3+ productos.
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-[#e8e1d3] pt-4">
                  <span className="font-serif text-lg">Total a pagar</span>
                  <strong className="text-xl text-[#987a42]">
                    {money(totalPromo)}
                  </strong>
                </div>

                <button
                  onClick={sendWhatsAppOrder}
                  className="mt-6 w-full bg-[#218c53] px-5 py-4 text-xs font-bold tracking-widest text-white transition hover:bg-[#176b3e]"
                >
                  ENVIAR PEDIDO POR WHATSAPP →
                </button>

                <p className="mt-3 text-center text-[10px] text-gray-400">
                  Tu pedido se enviará directamente por WhatsApp.
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
