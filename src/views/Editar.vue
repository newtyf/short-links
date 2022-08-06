<template>
  <div>
    <h1>Editar id: {{ route.params.id }}</h1>
    <a-form
      name="editForm"
      autocomplete="off"
      layout="vertical"
      :model="formState"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        name="url"
        label="ingrese URL"
        :rules="[
          {
            required: true,
            whitespace: true,
            pattern: /^https?:\/\/[\w\-]+(\.[\w\-]+)+[\#?]?.*$/,
            message: 'Ingrese una URL valida',
          },
        ]"
      >
        <a-input
          type="text"
          placeholder="Ingrese URL"
          v-model:value="formState.url"
          :disabled="databaseStore.loadingDoc"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="databaseStore.loading">Editar</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { message } from "ant-design-vue";
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { useDatabaseStore } from "../stores/database";

const databaseStore = useDatabaseStore();
const route = useRoute();

const formState = reactive({
  url: ''
})

const onFinish = async() => {
  const res = await databaseStore.updateUrl(route.params.id, formState.url);

  if (!res) {
    return message.success('Se actualizo con exito ⚡')
  }
  return message.error(res)

}

const onFinishFailed = () => {
  console.log('fallo');
}

onMounted(async () => {
  formState.url = await databaseStore.leerUrl(route.params.id);
});
</script>
