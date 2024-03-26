<script setup>
  import {ref, onMounted, reactive, computed} from 'vue';
  import Alerta from './components/Alerta.vue'
  import Spinner from './components/Spinner.vue'

  const monedas = ref([
      { codigo: 'USD', texto: 'Dolar'},
      { codigo: 'EUR', texto: 'Euro'},
      { codigo: 'GBP', texto: 'Libra Esterlina'},
  ]);

  const error = ref();
  const criptomonedas = ref([]);
  const cotizar = reactive({
    moneda: '',
    cripto: ''
  })
  const cotizacion = ref({});
  const cargando = ref(false);

  onMounted(() => {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD';
    fetch(url)
      .then(respuesta => respuesta.json())
      .then(({Data}) => criptomonedas.value = Data)
  });

  const cotizarCripto = () => {
    // Validar que cotizar este lleno
    if(Object.values(cotizar).includes('')){
      error.value = 'Todos los campos son Obligatorios';
      return;
    }

    error.value = '';
    obtenerCotizacion();
  }

  const obtenerCotizacion = async () => {
    cargando.value = true;
    cotizacion.value = {};
    try {
      const { moneda, cripto} = cotizar;
      const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto}&tsyms=${moneda}`;

      const respuesta = await fetch(url);
      const data = await respuesta.json();
      cotizacion.value = data.DISPLAY[cripto][moneda];
    } catch (error) {
      console.log(error)
    }finally{
      cargando.value = false;
    }
  }

  const mostrarCotizacion = computed(() => {
    return Object.values(cotizacion.value).length > 0;
  })
</script>

<template>
  <div class="contenedor">
    <h1 class="titulo">Cotizador de <span>Criptomonedas</span></h1>

    <div class="contenido">
      <Alerta 
        v-if="error"
      >
        {{ error }}
      </Alerta>
      <form 
        class="formulario"
        @submit.prevent="cotizarCripto"
      >
        <div class="campo">
          <label for="moneda">Moneda:</label>
          <select 
            id="moneda"
            v-model="cotizar.moneda"
          >
            <option value="">-- Selecciona --</option>
            <option 
              v-for="moneda in monedas" 
              :value="moneda.codigo"
            >
              {{moneda.texto}}
            </option>
          </select>
        </div>

        <div class="campo">
          <label for="cripto">Criptomoneda:</label>
          <select 
            id="cripto"
            v-model="cotizar.cripto"
          >
            <option value="">-- Selecciona --</option>
            <option 
              v-for="criptomoneda in criptomonedas" 
              :value="criptomoneda.CoinInfo.Name"
            >
              {{criptomoneda.CoinInfo.FullName}}
            </option>
          </select>
        </div>

        <input type="submit" value="Cotizar">
      </form>

      <Spinner 
        v-if="cargando"
      />

      <div 
        class="contenedor-resultado"
        v-if="mostrarCotizacion"
      >
        <h2>Cotizacion</h2>

        <div class="resultado">
          <img 
            :src="'Https://cryptocompare.com'+cotizacion.IMAGEURL" 
            alt="imagen cripto"
          >
          <div>
            <p>El precio es de: <span>{{ cotizacion.PRICE }}</span></p>
            <p>El precio mas alto del dia: <span>{{ cotizacion.HIGHDAY }}</span></p>
            <p>El precio mas bajo del dia: <span>{{ cotizacion.LOWDAY }}</span></p>
            <p>Variacion ultimas 24 horas: <span>{{ cotizacion.CHANGEPCT24HOUR }}%</span></p>
            <p>Ultima Actualizacion: <span>{{ cotizacion.LASTUPDATE }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>