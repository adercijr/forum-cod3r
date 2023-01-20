<template>  
    <aside class="menu" v-show="isMenuVisible">
        <div class="menu-filter">
            <i class="fa fa-search fa-lg mr-3"></i>
            <input type="text" placeholder="Type to filter..." 
                v-model="treeFilter" class="filter-field">
        </div>
        <Tree :data="treeData" :options="treeOptions" 
            :filter="treeFilter" @node:expanded="onNodeExpand" ref="tree" />
    </aside>
</template>

<script>
import { mapState } from "vuex"
import Tree from "liquor-tree"
import { baseApiUrl } from "@/global"
import axios from "axios"

export default {
  name: "Menu",
  components: { Tree },
  computed: mapState(["isMenuVisible"]),
  data: function() {
    return {
      treeFilter: "",
      treeData: this.getTreeData(),
      treeOptions: {
        propertyNames: { text: "name" },
        filter: { emptyText: "Categoria não encontrada" },
      },
    }
  },
  methods: {
    getTreeData() {
      const url = `${baseApiUrl}/categories/tree`
      return axios.get(url).then((res) => res.data)
    },
    onNodeSelect(node) {
      this.$router.push({
        name: "articlesByCategory",
        params: { id: node.id },
      })
      // ----------- mq - definir responsividade-----------
      // fecha o menu depois de selecionar
      if (this.$mq === "xs" || this.$mq === "sm") {
        this.$store.commit("toggleMenu", false)
      }
    },
    onNodeExpand(node) {
      const expandedNodes = this.$refs.tree.findAll({
        state: { expanded: true },
      })

      expandedNodes.forEach((expandedNode) => {
        if (expandedNode.id !== node.id && node.depth === expandedNode.depth) {
          expandedNode.collapse()
        }
      })
    },
  },
  mounted() {
    this.$refs.tree.$on("node:selected", this.onNodeSelect)
  },
}
</script>

<style>
.menu {
  grid-area: menu;
  background: linear-gradient(to right, #232526, #414345);

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.menu a,
.menu a:hover {
  color: #fff;
  text-decoration: none;
}
.menu .tree-node.selected > .tree-content,
.menu .tree-node .tree-content:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.tree-arrow.has-child {
  filter: brightness(2);
}
.menu .menu-filter {
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #aaa;
}
.menu .menu-filter i {
  color: #aaa;
}
.menu input {
  color: #ccc;
  font-size: 1.3tem;
  border: 0;
  outline: 0;
  width: 100%;
  background: transparent;
}
.tree-filter-empty {
  color: #ccc;
  margin-left: 20px;
}
</style>
