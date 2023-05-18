import { SortBy, type User } from '../types.d'

interface Props {
  users: User[]
  showColors: boolean
  deleteUser: (email: string) => void
  sortByColumnHeader: (columnHeader: SortBy) => void
}

export const UsersList = ({ users, showColors, deleteUser, sortByColumnHeader }: Props) => {
  return (
    <table className={showColors ? 'usersTable rowColor' : 'usersTable'}>
      <thead>
        <tr>
          <th>Foto</th>
          <th onClick={() => { sortByColumnHeader(SortBy.NAME) }}>Nombre</th>
          <th onClick={() => { sortByColumnHeader(SortBy.LAST) }}>Apellido</th>
          <th onClick={() => { sortByColumnHeader(SortBy.COUNTRY) }}>País</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users?.map(user => {
          const { name, location, picture, email } = user

          return (
            <tr key={email}>
              <td>
                <img src={picture.thumbnail} alt="" />
              </td>
              <td>{name.first}</td>
              <td>{name.last}</td>
              <td>{location.country}</td>
              <td>
                <button type="button" onClick={() => { deleteUser(email) }}>Borrar</button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
