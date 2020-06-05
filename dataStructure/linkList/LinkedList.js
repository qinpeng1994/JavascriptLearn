/*
链表数据结构是js数组的底层
 */  
// 创建列表
function Node(value) {
    this.value = value;
    this.next = null;
};
var a = new Node("a");
var b = new Node("b");
var c = new Node("c");
a.next = b;
b.next = c;
// console.log(a)

//1、遍历打印一个链表结构
/**
 * @param {给定的根节点} root
 */
function print(root) {
    var node = root;
    //穷举法
    // while(node) {
    //     console.log(node.value);
    //     node = node.next
    // }
    if(node) {
        console.log(node.value);
        print(node.next)
    }
}
// print(c)

// 2、获取链表的长度
/**
 * @param {给定的节点} root 
 */ 
function count(root) {
    if(!root) return 0;
    if(root){
        return 1 + count(root.next)
    }

}
// console.log(count(b))

//3 、获取链表的某一个数据
/**
 * @param {给定的列表} root
 * @param {列表的某一项} index
 */
function getValue(root,index) {
      function _getValue(node,i) {
            if(index === i) {
                return node.value;
            }else{
                return _getValue(node.next,i+1)
            }
      }
      return _getValue(root,0)
};
//console.log(getValue(a,2))

//3、通过下标设置链表的某个数据\
/**
 * @param {给定的根元素} root
 * @param {链表的某个数据索引} index
 * @param {设成那个值} value
 */
function setValue(root,index,value) {
    function _setValue(node,i){
        if(index === i) {
            return node.value = value
        }else{
            return _setValue(node.next,i+1)
        }
    }
   return _setValue(root,0) 
}
//console.log(setValue(a,2,"x"));
//console.log(a)

//5、在链表的某一节点加入一个新节点
function insertAfter(root,newValue) {
    var newNode = new Node(newValue);
    if(!root) return;
    if(root){
        newNode.next = root.next;
        root.next = newNode
    }
}
// insertAfter( b,"fjdkf");
// print(a)

//6、在链表的末尾添加一个新节点
function push(root,newValue) {
    var newNode = new Node(newValue);
    if(!root) return;
    if(!root.next) {
        root.next = newNode;
    }else{
        push(root.next,newNode)
    }
}
// push(b,"fhjiewhf")
// print(b)

//7、删除一个节点,以一个节点为例
// function removeItem(root,newValue) {
//     if(!root || !root.next) return null;
//     if(root.next === newValue) {
//         root.next = root.next.next
//     }else{
//         removeItem(root.next,newValue)
//     }
// }
// removeItem(a,c)
// print(a)
//删除一个节点 一索引为例
function removeItem(root,index){
    if(!root ||!root.next) return null;
    if(count(root) <=index) return null
    function _removeItem(node,i) {
        if(index === i+1) {
            node.next = node.next.next
        }else{
            _removeItem(node.next,i+1)
        }
    }
    return _removeItem(root,0)
}
// removeItem(a,2)
// print(a)
// 8 链表倒序
function reverse(root) {
    // 1个
    if(!root || !root.next) return root;
    // 2个
    if(!root.next.next){
        var temp = root.next;
        root.next.next = root;
        root.next = null;
        return temp;
    }else{
        var temp = reverse(root.next);
        root.next.next = root;
        root.next = null;
        return temp;
    }
};
console.log(reverse(a));