import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, Star,
  Truck, ShieldCheck, RotateCcw, CreditCard, Plus, Minus, Trash2,
  ArrowRight, Check, MapPin, Tag, Instagram, Facebook, MessageCircle
} from "lucide-react";
import "./styles.css";

const PRODUCTS = [
  {
    id: 1, name: "Áo thun Essential", category: "Áo", price: 329000, oldPrice: 399000,
    rating: 4.9, reviews: 128, badge: "Bán chạy",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    colors: ["Đen", "Trắng", "Xám"], sizes: ["S", "M", "L", "XL"],
    desc: "Áo thun cotton premium, form regular dễ mặc, phù hợp đi học, đi làm và đi chơi."
  },
  {
    id: 2, name: "Sơ mi Oxford", category: "Áo", price: 549000, oldPrice: 649000,
    rating: 4.8, reviews: 86, badge: "Mới",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    colors: ["Trắng", "Xanh"], sizes: ["S", "M", "L", "XL"],
    desc: "Sơ mi Oxford tối giản với chất vải đứng form, phù hợp cả phong cách casual và công sở."
  },
  {
    id: 3, name: "Quần jeans Straight", category: "Quần", price: 699000, oldPrice: 799000,
    rating: 4.9, reviews: 214, badge: "Bán chạy",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85",
    colors: ["Xanh đậm", "Xanh nhạt"], sizes: ["28", "30", "32", "34"],
    desc: "Quần jeans straight fit, denim bền đẹp, dễ phối cùng áo thun hoặc sơ mi."
  },
  {
    id: 4, name: "Áo khoác Varsity", category: "Áo khoác", price: 899000, oldPrice: 1099000,
    rating: 4.7, reviews: 61, badge: "Sale",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85",
    colors: ["Đen", "Nâu"], sizes: ["M", "L", "XL"],
    desc: "Áo khoác varsity hiện đại, phối layer cực đẹp cho những ngày se lạnh."
  },
  {
    id: 5, name: "Quần short Daily", category: "Quần", price: 399000, oldPrice: 459000,
    rating: 4.8, reviews: 93, badge: "",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=900&q=85",
    colors: ["Đen", "Kem", "Xanh"], sizes: ["S", "M", "L", "XL"],
    desc: "Quần short basic, nhẹ và thoải mái, thích hợp mặc hàng ngày."
  },
  {
    id: 6, name: "Hoodie Minimal", category: "Áo khoác", price: 749000, oldPrice: 849000,
    rating: 4.9, reviews: 147, badge: "Mới",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
    colors: ["Đen", "Kem", "Xám"], sizes: ["M", "L", "XL"],
    desc: "Hoodie nỉ mềm, thiết kế minimal, form rộng vừa phải và dễ phối đồ."
  },
  {
    id: 7, name: "Sneaker Urban", category: "Giày", price: 990000, oldPrice: 1190000,
    rating: 4.8, reviews: 172, badge: "Hot",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    colors: ["Trắng", "Đen"], sizes: ["39", "40", "41", "42", "43"],
    desc: "Sneaker phong cách urban, đế êm và thiết kế dễ phối với nhiều outfit."
  },
  {
    id: 8, name: "Túi đeo chéo Basic", category: "Phụ kiện", price: 299000, oldPrice: 359000,
    rating: 4.6, reviews: 55, badge: "",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
    colors: ["Đen", "Nâu"], sizes: ["Free Size"],
    desc: "Túi đeo chéo nhỏ gọn, nhiều ngăn, phù hợp đi học và đi chơi."
  }
];

const money = (n) => new Intl.NumberFormat("vi-VN", {
  style: "currency", currency: "VND", maximumFractionDigits: 0
}).format(n);

function App() {
  const [category, setCategory] = useState("Tất cả");
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [checkout, setCheckout] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const categories = ["Tất cả", "Áo", "Quần", "Áo khoác", "Giày", "Phụ kiện"];

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p =>
      (category === "Tất cả" || p.category === category) &&
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "low") list.sort((a,b) => a.price - b.price);
    if (sort === "high") list.sort((a,b) => b.price - a.price);
    if (sort === "rating") list.sort((a,b) => b.rating - a.rating);
    return list;
  }, [category, query, sort]);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const shipping = subtotal >= 1000000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shipping;

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const openProduct = (p) => {
    setProduct(p);
    setSelectedSize(p.sizes[0]);
    setSelectedColor(p.colors[0]);
  };

  const addToCart = (p, size = p.sizes[0], color = p.colors[0]) => {
    setCart(prev => {
      const key = `${p.id}-${size}-${color}`;
      const found = prev.find(x => x.key === key);
      if (found) return prev.map(x => x.key === key ? {...x, qty: x.qty + 1} : x);
      return [...prev, {key, id:p.id, name:p.name, price:p.price, image:p.image, size, color, qty:1}];
    });
    notify("Đã thêm sản phẩm vào giỏ hàng");
  };

  const changeQty = (key, delta) => {
    setCart(prev => prev.map(x => x.key === key ? {...x, qty: x.qty + delta} : x).filter(x => x.qty > 0));
  };

  const toggleWish = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="app">
      <div className="topbar">MIỄN PHÍ VẬN CHUYỂN ĐƠN TỪ 1.000.000₫ · ĐỔI TRẢ TRONG 30 NGÀY</div>

      <header className="header">
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><Menu /></button>
        <a className="logo" href="#">NOVA<span>.</span></a>
        <nav className={menuOpen ? "nav open" : "nav"}>
          {categories.map(c => (
            <button key={c} onClick={() => {setCategory(c); setMenuOpen(false); document.getElementById("products").scrollIntoView({behavior:"smooth"})}}>
              {c}
            </button>
          ))}
          <button onClick={() => {setCategory("Tất cả"); setMenuOpen(false)}}>Bộ sưu tập</button>
          <button>Về chúng tôi</button>
        </nav>

        <div className="header-actions">
          <div className="search">
            <Search size={18}/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Tìm kiếm sản phẩm..." />
          </div>
          <button className="icon-btn" title="Tài khoản"><User /></button>
          <button className="icon-btn heart" onClick={() => notify(`${wishlist.length} sản phẩm trong yêu thích`)}><Heart fill={wishlist.length ? "currentColor" : "none"}/></button>
          <button className="icon-btn bag" onClick={() => setCartOpen(true)}><ShoppingBag />{cartCount > 0 && <b>{cartCount}</b>}</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">NEW SEASON · 2026</span>
            <h1>Mặc đẹp.<br/><em>Sống chất.</em></h1>
            <p>Bộ sưu tập thời trang tối giản dành cho những ngày bạn muốn xuất hiện thật tự tin.</p>
            <div className="hero-buttons">
              <button className="primary" onClick={() => document.getElementById("products").scrollIntoView({behavior:"smooth"})}>Mua sắm ngay <ArrowRight size={18}/></button>
              <button className="secondary" onClick={() => setCategory("Áo")}>Khám phá bộ sưu tập</button>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=90" />
            <div className="hero-tag"><strong>01</strong><span>Essential<br/>Collection</span></div>
          </div>
        </section>

        <section className="benefits">
          <div><Truck/><span><b>Miễn phí vận chuyển</b>Đơn từ 1.000.000₫</span></div>
          <div><ShieldCheck/><span><b>Thanh toán an toàn</b>Bảo mật 100%</span></div>
          <div><RotateCcw/><span><b>Đổi trả 30 ngày</b>Đổi size dễ dàng</span></div>
          <div><CreditCard/><span><b>Thanh toán khi nhận</b>COD toàn quốc</span></div>
        </section>

        <section className="section" id="products">
          <div className="section-head">
            <div>
              <span className="eyebrow">SHOP ALL</span>
              <h2>Sản phẩm nổi bật</h2>
            </div>
            <div className="filters">
              <div className="cat-pills">
                {categories.map(c => <button className={category === c ? "active" : ""} key={c} onClick={() => setCategory(c)}>{c}</button>)}
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="featured">Sắp xếp: Nổi bật</option>
                <option value="low">Giá thấp → cao</option>
                <option value="high">Giá cao → thấp</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? <div className="empty-products">Không tìm thấy sản phẩm phù hợp.</div> :
          <div className="product-grid">
            {filtered.map(p => (
              <article className="product-card" key={p.id}>
                <div className="product-image" onClick={() => openProduct(p)}>
                  {p.badge && <span className="badge">{p.badge}</span>}
                  <button className="wish" onClick={(e) => {e.stopPropagation(); toggleWish(p.id)}}><Heart size={19} fill={wishlist.includes(p.id) ? "currentColor" : "none"}/></button>
                  <img src={p.image} alt={p.name}/>
                  <button className="quick-add" onClick={(e) => {e.stopPropagation(); addToCart(p)}}>Thêm vào giỏ</button>
                </div>
                <div className="product-info">
                  <div className="rating"><Star size={14} fill="currentColor"/>{p.rating} <span>({p.reviews})</span></div>
                  <h3 onClick={() => openProduct(p)}>{p.name}</h3>
                  <div className="price-row"><strong>{money(p.price)}</strong>{p.oldPrice && <del>{money(p.oldPrice)}</del>}</div>
                </div>
              </article>
            ))}
          </div>}
        </section>

        <section className="banner">
          <div><span className="eyebrow">NOVA ESSENTIALS</span><h2>Less, but better.</h2><p>Những món đồ cơ bản nhưng đủ khác biệt để tạo nên phong cách của riêng bạn.</p><button className="secondary light" onClick={() => {setCategory("Tất cả"); document.getElementById("products").scrollIntoView({behavior:"smooth"})}}>Xem bộ sưu tập <ArrowRight size={17}/></button></div>
        </section>

        <section className="section categories-section">
          <div className="section-head"><div><span className="eyebrow">EXPLORE</span><h2>Mua theo danh mục</h2></div></div>
          <div className="category-grid">
            {[
              ["Áo","https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"],
              ["Quần","https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80"],
              ["Giày","https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"],
              ["Phụ kiện","https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"]
            ].map(([name,img]) => <button key={name} onClick={() => {setCategory(name); document.getElementById("products").scrollIntoView({behavior:"smooth"})}}><img src={img}/><span>{name}<ArrowRight size={17}/></span></button>)}
          </div>
        </section>

        <section className="newsletter">
          <div><span className="eyebrow">STAY IN THE LOOP</span><h2>Nhận ưu đãi & bộ sưu tập mới</h2><p>Đăng ký email để nhận voucher 10% cho đơn hàng đầu tiên.</p></div>
          <form onSubmit={e => {e.preventDefault(); notify("Đăng ký nhận tin thành công!")}}><input type="email" required placeholder="Email của bạn"/><button className="primary">Đăng ký <ArrowRight size={17}/></button></form>
        </section>
      </main>

      <footer>
        <div className="footer-main">
          <div><a className="logo" href="#">NOVA<span>.</span></a><p>Thời trang tối giản cho cuộc sống hiện đại.</p><div className="socials"><Instagram/><Facebook/><MessageCircle/></div></div>
          <div><h4>SHOP</h4><a>Áo</a><a>Quần</a><a>Áo khoác</a><a>Giày</a></div>
          <div><h4>HỖ TRỢ</h4><a>Liên hệ</a><a>Chính sách đổi trả</a><a>Vận chuyển</a><a>FAQ</a></div>
          <div><h4>CỬA HÀNG</h4><p>123 Nguyễn Huệ, Q.1<br/>TP. Hồ Chí Minh</p><p>09 1234 5678<br/>support@nova.vn</p></div>
        </div>
        <div className="copyright">© 2026 NOVA Fashion. Demo React.js — chưa kết nối thanh toán thật.</div>
      </footer>

      {product && <div className="overlay" onClick={() => setProduct(null)}>
        <div className="product-modal" onClick={e => e.stopPropagation()}>
          <button className="close" onClick={() => setProduct(null)}><X/></button>
          <img src={product.image} alt={product.name}/>
          <div className="modal-content">
            <div className="rating"><Star size={14} fill="currentColor"/>{product.rating} · {product.reviews} đánh giá</div>
            <h2>{product.name}</h2>
            <div className="modal-price">{money(product.price)} {product.oldPrice && <del>{money(product.oldPrice)}</del>}</div>
            <p>{product.desc}</p>
            <label>Màu sắc</label><div className="choices">{product.colors.map(c => <button className={selectedColor === c ? "selected" : ""} onClick={() => setSelectedColor(c)} key={c}>{c}</button>)}</div>
            <label>Kích thước</label><div className="choices">{product.sizes.map(s => <button className={selectedSize === s ? "selected" : ""} onClick={() => setSelectedSize(s)} key={s}>{s}</button>)}</div>
            <button className="primary full" onClick={() => {addToCart(product, selectedSize, selectedColor); setProduct(null); setCartOpen(true)}}>Thêm vào giỏ hàng <ShoppingBag size={18}/></button>
          </div>
        </div>
      </div>}

      {cartOpen && <div className="overlay cart-overlay" onClick={() => setCartOpen(false)}>
        <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
          <div className="cart-head"><div><span className="eyebrow">YOUR BAG</span><h2>Giỏ hàng ({cartCount})</h2></div><button className="close" onClick={() => setCartOpen(false)}><X/></button></div>
          {cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={45}/><h3>Giỏ hàng đang trống</h3><p>Hãy thêm vài món bạn thích nhé.</p><button className="primary" onClick={() => {setCartOpen(false); document.getElementById("products").scrollIntoView({behavior:"smooth"})}}>Tiếp tục mua sắm</button></div> :
          <>
            <div className="cart-items">{cart.map(item => <div className="cart-item" key={item.key}><img src={item.image}/><div className="cart-item-info"><h4>{item.name}</h4><small>{item.color} · {item.size}</small><strong>{money(item.price)}</strong><div className="qty"><button onClick={() => changeQty(item.key,-1)}><Minus size={14}/></button><span>{item.qty}</span><button onClick={() => changeQty(item.key,1)}><Plus size={14}/></button><button className="delete" onClick={() => setCart(prev => prev.filter(x => x.key !== item.key))}><Trash2 size={15}/></button></div></div></div>)}</div>
            <div className="cart-bottom"><div><span>Tạm tính</span><strong>{money(subtotal)}</strong></div><div><span>Phí vận chuyển</span><strong>{shipping === 0 ? "Miễn phí" : money(shipping)}</strong></div><div className="total"><span>Tổng cộng</span><strong>{money(total)}</strong></div><button className="primary full" onClick={() => {setCartOpen(false); setCheckout(true)}}>Tiến hành thanh toán <ArrowRight size={18}/></button><small className="secure"><ShieldCheck size={14}/> Thanh toán an toàn & bảo mật</small></div>
          </>}
        </aside>
      </div>}

      {checkout && <div className="overlay" onClick={() => setCheckout(false)}>
        <div className="checkout-modal" onClick={e => e.stopPropagation()}>
          <button className="close" onClick={() => setCheckout(false)}><X/></button>
          <div className="checkout-title"><span className="eyebrow">CHECKOUT</span><h2>Thông tin giao hàng</h2></div>
          <form onSubmit={e => {e.preventDefault(); setCheckout(false); setCart([]); notify("Đặt hàng thành công! Đây là bản demo.")}}>
            <div className="form-grid"><label>Họ và tên<input required placeholder="Nguyễn Văn A"/></label><label>Số điện thoại<input required placeholder="09xxxxxxxx"/></label></div>
            <label>Email<input type="email" required placeholder="email@example.com"/></label>
            <label>Địa chỉ nhận hàng<input required placeholder="Số nhà, đường, phường/xã..."/></label>
            <div className="form-grid"><label>Tỉnh / Thành phố<select><option>TP. Hồ Chí Minh</option><option>Hà Nội</option><option>Đà Nẵng</option><option>Tỉnh khác</option></select></label><label>Phương thức thanh toán<select><option>Thanh toán khi nhận hàng (COD)</option><option>Chuyển khoản ngân hàng</option></select></label></div>
            <label>Ghi chú<textarea placeholder="Ghi chú cho người giao hàng..."/></label>
            <div className="checkout-total"><span>Tổng thanh toán</span><strong>{money(total)}</strong></div>
            <button className="primary full" type="submit">Xác nhận đặt hàng <Check size={18}/></button>
          </form>
        </div>
      </div>}

      {toast && <div className="toast"><Check size={18}/>{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
