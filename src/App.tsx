import { useEffect, useMemo, useRef, useState } from 'react'

import { SortBy, type User } from './types.d'
import { UsersList } from './components/UsersList'
import './App.css'

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sortingBy, setSortingBy] = useState<SortBy>(SortBy.NONE)
  const [filterByCountry, setFilterByCountry] = useState<string>('')

  const originalUsers = useRef<User[]>([])
  // useRef -> para guardar un valor
  // que queremos que se comparta entre renderizados
  // pero que al cambiar, no vuelva a renderizar el componente

  const url = 'https://randomuser.me/api/?results=100'

  useEffect(() => {
    fetch(url)
      .then(async response => await response.json())
      .then(data => {
        const users = data.results
        setUsers(users)
        // TODO: loading
        // TODO: error
        originalUsers.current = users
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const sortUsersByCountry = () => {
    const columnHeader = sortingBy === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSortingBy(columnHeader)
  }

  const deleteUser = (email: string) => {
    const newUsers = users.filter(user => user.email !== email)
    setUsers(newUsers)
  }

  const resetUsers = () => {
    setUsers(originalUsers.current)
    setFilterByCountry('')
    setSortingBy(SortBy.NONE)
  }

  const sortByColumnHeader = (columnHeader: SortBy) => {
    setSortingBy(columnHeader)
  }

  const filteredUsers = useMemo(() =>
    filterByCountry.trim() !== ''
      ? users.filter(user => (user.location.country).toLowerCase().includes(filterByCountry.toLowerCase()))
      : users
  , [users, filterByCountry])

  const sortedUsers = useMemo(() => {
    const usersToCompare = (user: User): string => {
      const compareBy = {
        [SortBy.COUNTRY]: user.location.country,
        [SortBy.NAME]: user.name.first,
        [SortBy.LAST]: user.name.last,
        [SortBy.NONE]: user.location.country
      }

      return compareBy[sortingBy]
    }

    return sortingBy !== SortBy.NONE
      ? [...filteredUsers].sort((a, b) => usersToCompare(a).localeCompare(usersToCompare(b)))
      : filteredUsers
  }, [filteredUsers, sortingBy])

  return (
    <div className="App">
      <header>
        <h1>Users table</h1>
      </header>
      <main>
        <div className="buttons">
          <button type="button" onClick={toggleColors}>
            Colorear filas
          </button>

          <button type="button" onClick={sortUsersByCountry}>
            {sortingBy === SortBy.COUNTRY ? 'No ordenar por país' : 'Ordenar por país'}
          </button>

          <button type="button" onClick={resetUsers}>
            Resetear estado
          </button>

          <input type="text" placeholder="Filtrar por país" name="searchByCountry" onChange={(e) => {
            setFilterByCountry(e.target.value)
          }} />
        </div>

        <UsersList
          users={sortedUsers}
          showColors={showColors}
          deleteUser={deleteUser}
          sortByColumnHeader={sortByColumnHeader}
        />
      </main>
    </div>
  )
}

export default App
