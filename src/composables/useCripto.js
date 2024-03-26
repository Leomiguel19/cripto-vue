import {ref, onMounted, reactive, computed} from 'vue';

export default function useCripto(){
    const criptomonedas = ref([]);
    const cotizacion = ref({});
    const cargando = ref(false);  
    const monedas = ref([
        { codigo: 'USD', texto: 'Dolar'},
        { codigo: 'EUR', texto: 'Euro'},
        { codigo: 'GBP', texto: 'Libra Esterlina'},
    ]);

    onMounted(() => {
        const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD';
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(({Data}) => criptomonedas.value = Data)
    });

    const obtenerCotizacion = async (cotizar) => {
        cargando.value = true;
        cotizacion.value = {};
        try {
            const { moneda, cripto } = cotizar;
            const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cripto}&tsyms=${moneda}`;

            const respuesta = await fetch(url);
            const data = await respuesta.json();
            cotizacion.value = data.DISPLAY[cripto][moneda];
        } catch (error) {
            console.log(error);
        } finally {
            cargando.value = false;
        }
    };

    const mostrarCotizacion = computed(() => {
        return Object.values(cotizacion.value).length > 0;
    })

    return {
        monedas,
        criptomonedas,
        cotizacion,
        cargando,
        obtenerCotizacion,
        mostrarCotizacion
    }
}