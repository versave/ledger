import PageHeader from '../../layout/PageHeader/PageHeader'
import Cards from './sections/Cards'
import Charts from './sections/Charts'
import Colors from './sections/Colors'
import Controls from './sections/Controls'
import Shape from './sections/Shape'
import Tables from './sections/Tables'
import Typography from './sections/Typography'

export default function Styleguide() {
  return (
    <>
      <PageHeader
        title="Styleguide"
        desc="Design tokens and every reusable component in src/components. Tokens live in src/styles/_tokens.scss."
      />
      <Colors />
      <Typography />
      <Shape />
      <Controls />
      <Cards />
      <Tables />
      <Charts />
    </>
  )
}
