import ModalCreateUser from '../Content/ModalCreateUser'
import './ManageUser.scss';

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
                </div>
                <ModalCreateUser />
            </div>
        </div>
    )
}

export default ManageUser;