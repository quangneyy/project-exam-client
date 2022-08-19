import ModalCreateUser from '../Content/ModalCreateUser'

const ManageUser = (props) => {
    return (
        <div className="manage-user-container">
            <div className="title">
                Manage User
            </div>
            <div className="user-content">
                <div>
                    <button>Add new users</button>
                </div>
                <div>
                    table users
                    <ModalCreateUser />
                </div>
            </div>
        </div>
    )
}

export default ManageUser;