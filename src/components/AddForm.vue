<template>
  <a-form
    name="addForm"
    autocomplete=""
    layout="vertical"
    :model="formState"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      name="url"
      label="Ingrese una URL"
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
        placeholder="ingrese url"
        v-model:value="formState.url"
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" :loading="databaseStore.loading">Agregar</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { message } from "ant-design-vue";
import { reactive } from "vue";
import { useDatabaseStore } from "../stores/database";

const databaseStore = useDatabaseStore();
const formState = reactive({
  url: "",
});

const onFinish = async (value) => {
  console.log(value);
  const res = await databaseStore.addUrl(formState.url);
  switch (res) {
    case undefined:
      formState.url = '';
      message.success("URL agregada!🍙🍙");
      break;
    default:
      message.error('Algo salio mal... 😷')
      break;
  }
};

const onFinishFailed = async (errorInfo) => {
  message.warning('Esta ingresando una URL invalida 😡', 1)
};
</script>

<style lang="scss" scoped></style>
