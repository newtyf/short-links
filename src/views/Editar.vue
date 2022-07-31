<template>
  <div>
    <h1>Editar id: {{route.params.id}}</h1>
    <form @submit.prevent="handleSubmit">
      <input type="text" placeholder="Ingrese URL" v-model="url">
      <button type="submit">Editar</button>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useDatabaseStore } from '../stores/database'

const databaseStore = useDatabaseStore()
const route = useRoute()

const url = ref('')

const handleSubmit = () => {
  // validaciones del input

  databaseStore.updateUrl(route.params.id, url.value)
}

onMounted(async () =>{
  url.value = await databaseStore.leerUrl(route.params.id)
})

</script>
