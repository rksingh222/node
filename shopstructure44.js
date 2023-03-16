res.render('admin/add-product'
res.render('shop/product-list'

admin/add-product.ejs
admin/edit-product.ejs
admin/products.ejs        
           
shop/product-list.ejs
shop/index.ejs
shop/product-detail.ejs
shop/cart.ejs
shop/checkout.ejs

includes/navigation.ejs

<header class="main-header">
<nav class="main_header_nav">
<ul class="main_header__item-list">
<li class="main-header__item">
<a class="<%= path === '/'? 'active':'' %>" href="/">Shop</a>
</li>
<li class="main-header__item">
<a class="<%= path === '/products'? 'active':'' %>" href="/products">products</a>
</li>
<li class="main-header__item">
<a class="<%= path === '/cart'? 'active':'' %>" href="/cart">Cart</a>
</li>
<li class="main-header__item">
<a class="<%= path === '/admin/add-product'? 'active':'' %>" href="/admin/add-prouct">Add Product</a>
</li>    
<li class="main-header__item">
<a class="<%= path === '/admin/products'? 'active':'' %>" href="/admin/products">Admin Products</a>
</li>  
</ul>
</nav>
</header>
