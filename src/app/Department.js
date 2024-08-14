const Department = (props) => {
    return (
        <div className="department-listing" id={props.data.departmentId} onClick={() => props.handleDepartmentClick(props.data.departmentId, props.data.displayName)}>
            <img src={props.data.primaryImage} alt={props.data.title} width='200' height='200' />
            <h2>{props.data.displayName}</h2>
        </div>
    )
}

export default Department;