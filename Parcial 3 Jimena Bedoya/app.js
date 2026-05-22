
const { createApp } = Vue;

createApp({
  data() {
    return {

      scrolled: false,


      busqueda: '',
      categoriaActiva: null,


      carritoAbierto: false,
      carrito: [],
    toastVisible: false,
      toastMsg: '',

      categorias: [
        { id: 1, nombre: 'Analgésicos',   emoji: '💊' },
        { id: 2, nombre: 'Vitaminas',     emoji: '🍊' },
        { id: 3, nombre: 'Cuidado Personal', emoji: '🧴' },
        { id: 4, nombre: 'Bebés',         emoji: '👶' },
        { id: 5, nombre: 'Dermatología',  emoji: '🌿' },
        { id: 6, nombre: 'Digestivo',     emoji: '🫁' },
      ],


      productos: [
        {
          id: 1,
          nombre: 'Ibuprofeno ',
          descripcion: 'Analgésico y antiinflamatorio',
          precio: 12000,
          descuento: 15,
          categoria: 'Analgésicos',
          emoji: '💊',
        },
        {
          id: 2,
          nombre: 'Vitamina C',
          descripcion: 'Refuerza el sistema inmunológico',
          precio: 28000,
          descuento: null,
          categoria: 'Vitaminas',
          emoji: '🍊',
        },
        {
          id: 3,
          nombre: 'Crema Hidratante',
          descripcion: 'Hidratación profunda.',
          precio: 45000,
          descuento: 10,
          categoria: 'Dermatología',
          emoji: '🧴',
        },
        {
          id: 4,
          nombre: 'Multivitamínico Infantil',
          descripcion: 'Para niños de 3 a 12 años. 30 gomitas.',
          precio: 32000,
          descuento: null,
          categoria: 'Vitaminas',
          emoji: '🌈',
        },
        {
          id: 5,
          nombre: 'Paracetamol',
          descripcion: 'Alivio rápido del dolor y la fiebre',
          precio: 9500,
          descuento: null,
          categoria: 'Analgésicos',
          emoji: '🏥',
        },
        {
          id: 6,
          nombre: 'Pañales',
          descripcion: 'suavidad para tu bebé.',
          precio: 68000,
          descuento: 20,
          categoria: 'Bebés',
          emoji: '👶',
        },

      ],
    };
  },


  computed: {

    productosFiltrados() {
      let lista = this.productos;

      if (this.categoriaActiva) {
        lista = lista.filter(p => p.categoria === this.categoriaActiva);
      }

      if (this.busqueda.trim()) {
        const q = this.busqueda.toLowerCase();
        lista = lista.filter(p =>
          p.nombre.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q)
        );
      }

      return lista;
    },


    totalItems() {
      return this.carrito.reduce((sum, item) => sum + item.cantidad, 0);
    },

    totalPrecio() {
      const total = this.carrito.reduce((sum, item) => {
        return sum + this.precioFinal(item) * item.cantidad;
      }, 0);
      return total.toLocaleString('es-CO');
    },
  },

  methods: {

    onScroll() {
      this.scrolled = window.scrollY > 60;
    },


    precioFinal(prod) {
      if (!prod.descuento) return prod.precio.toLocaleString('es-CO');
      const final = Math.round(prod.precio * (1 - prod.descuento / 100));
      return final.toLocaleString('es-CO');
    },


    filtrarCategoria(nombre) {
      this.categoriaActiva = nombre;

      document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
    },


    toggleCarrito() {
      this.carritoAbierto = !this.carritoAbierto;

      document.body.style.overflow = this.carritoAbierto ? 'hidden' : '';
    },

    agregarAlCarrito(prod) {
      const existente = this.carrito.find(item => item.id === prod.id);
      if (existente) {
        existente.cantidad++;
      } else {
        this.carrito.push({ ...prod, cantidad: 1 });
      }
      this.mostrarToast(`${prod.nombre} añadido`);
    },

    /* Cambiar cantidad de un ítem */
    cambiarCantidad(index, delta) {
      const item = this.carrito[index];
      item.cantidad += delta;
      if (item.cantidad <= 0) {
        this.eliminar(index);
      }
    },

    /* Eliminar ítem del carrito */
    eliminar(index) {
      this.carrito.splice(index, 1);
    },

    /* Vaciar carrito completo */
    vaciarCarrito() {
      this.carrito = [];
    },

    /* Simular checkout */
    checkout() {
      if (this.carrito.length === 0) return;
      this.vaciarCarrito();
      this.toggleCarrito();
      this.mostrarToast('¡Compra realizada con éxito! 🎉');
    },

    /* Toast de confirmación */
    mostrarToast(msg) {
      this.toastMsg = msg;
      this.toastVisible = true;
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        this.toastVisible = false;
      }, 2800);
    },
  },
}).mount('#app');