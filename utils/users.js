const users=[];
//join users to chat
function userjoin(id,username,room)
{
    const user={id,username,room};
    users.push(user);
    return user;
}
function getcurrentuser(id)
{
    return users.find(user=>user.id==id);
}
//user leaves chat
function userleave(id)
{
    const index=users.findIndex(user=>user.id===id);
    if(index!=-1)
    {
        return users.splice(index,1)[0];
    }
}
//get room users
function getroomusers(room)
{
    return users.filter(user=>user.room===room);
}

module.exports={userjoin,getcurrentuser,userleave,getroomusers};