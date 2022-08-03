<template>
  <div>
    <h1>Home</h1>
    <p>{{ userStore.userData?.email }}</p>

    <AddForm />

    <p v-if="databaseStore.loadingDoc">Loading...</p>

    <a-space
      direction="vertical"
      v-if="!databaseStore.loadingDoc"
      style="width: 100%"
    >
      <a-card
        v-for="item of databaseStore.documents"
        :key="item.id"
        :title="item.short"
      >
        <template #extra>
          <a-space>
            <a-popconfirm
              title="Are you sure delete this task?"
              ok-text="yes"
              cancel-text="no"
              @confirm="confirm(item.id)"
              @cancel="cancel"
            >
              <a-button
                size="default"
                danger
                :disabled="databaseStore.loading"
                >Eliminar</a-button
              >
            </a-popconfirm>
            <a-button
              size="default"
              @click="router.push(`/editar/${item.id}`)"
              type="primary"
              :disabled="databaseStore.loading"
              >Editar</a-button
            >
          </a-space>
        </template>
        <p style="overflow: hidden ;">{{ item.name }}</p>
      </a-card>
    </a-space>
  </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { useDatabaseStore } from "../stores/database";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";

const userStore = useUserStore();
const databaseStore = useDatabaseStore();
const router = useRouter();

databaseStore.getUrls();

const confirm = async (id) => {
  const res = await databaseStore.deleteUrl(id)

  if (!res) {
    return message.success('se elimino con exito 🐐')
  }
  return message.error(res)

  // switch (res) {
  //   case undefined:
  //     message.success('Se elimino con exito 🐐')
  //     break;
  //   default:
  //     break;
  // }
}

const cancel = () => {
  message.success('No se elimino')
}
</script>
