const traderLog = require('debug')('w3b:store:trader')
const traderError = require('debug')('w3b:store:trader:error')

export const state = () => ({
  tradeSelectedItemFrom: null,
  tradeSelectedItemTo: null,
  itemFrom: {
    base_img:
      'https://2264006251-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MdunBb1X4ZSri9eSiAH%2Fuploads%2Fj3zLlHOEGa4kKLWE3qsv%2FTwitter_art.png?alt=media&token=bb90dda5-cf06-4395-bc59-42a3d45bb403',
    address: '0x999...123',
    project_name: 'SunFlower Farms',
    item_name: 'Sunflower',
    item_quantity: 1,
    type: 'ERC-721',
    item_logo_url:
      'https://aavegotchi.com/_next/image?url=%2Fimages%2Fitems%2F152.svg&w=128&q=75',
  },
  itemTo: {
    base_img:
      'https://2264006251-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MdunBb1X4ZSri9eSiAH%2Fuploads%2Fj3zLlHOEGa4kKLWE3qsv%2FTwitter_art.png?alt=media&token=bb90dda5-cf06-4395-bc59-42a3d45bb403',
    address: '0x123...999',
    project_name: 'SunFlower Farms',
    item_name: 'potato',
    item_quantity: 30,
    item_logo_url:
      'blob:https://aavegotchi.com/6419374b-3038-4ec6-a8f6-d2acaa172a98',
  },
  projectFromItems: [
    {
      item_name: 'Mythical Rofl',
      item_logo_url:
        'https://aavegotchi.com/_next/image?url=%2Fimages%2Fitems%2F155.svg&w=256&q=75',
      item_quantity: '5',
    },
  ],
  projectToItems: [
    {
      item_name: 'Aantenna Bot',
      item_logo_url:
        'https://aavegotchi.com/_next/image?url=%2Fimages%2Fitems%2F261.svg&w=256&q=75',
      item_quantity: '3',
    },
  ],
  projects: [
    {
      project_name: ' bazaar721',
      description: 'Test contract for weebazaar ERC721',
      base_img:
        'https://2264006251-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MdunBb1X4ZSri9eSiAH%2Fuploads%2Fj3zLlHOEGa4kKLWE3qsv%2FTwitter_art.png?alt=media&token=bb90dda5-cf06-4395-bc59-42a3d45bb403',
      contractAddress: '0xb48342Ff701dDff44C7A1EEC9C0293B4F2947e53',
      baseUrl: 'https://api-testnet.polygonscan.com/',
      network: 'MUMBAI',
      contractType: 'ERC721',
      discord: '',
      twitter: '',
      api_metadata: 'https://webazaar-meta-api.herokuapp.com/detail/{id}',
      api_metadata_sample: {
        name: '',
        description: '',
        image: '',
      },
    },
    {
      project_name: 'bazaar1155',
      description: 'Test contract for weebazaar ERC721',
      base_img:
        'https://blog.bitnovo.com/wp-content/uploads/2021/11/Que%CC%81-es-Aavegotchi1.jpg',
      contractAddress: '0x327Eb3d1D5aeC78b52683a73f4aF4EdEFCC1F4b9',
      baseUrl: 'https://api-testnet.polygonscan.com/',
      network: 'MUMBAI',
      contractType: 'ERC1155',
      discord: '',
      twitter: '',
      api_metadata: 'https://webazaar-meta-api.herokuapp.com/detail/{id}',
      api_metadata_sample: {
        name: '',
        description: '',
        image: '',
      },
    },
    {
      project_name: 'Weenus - bazaarERC20',
      description: 'Test contract for weebazaar ERC20',
      base_img:
        'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
      contractAddress: '0xaFF4481D10270F50f203E0763e2597776068CBc5',
      baseUrl: 'https://api-testnet.polygonscan.com/',
      network: 'MUMBAI',
      contractType: 'ERC20',
      discord: '',
      twitter: '',
      api_metadata: 'https://webazaar-meta-api.herokuapp.com/detail/{id}',
      api_metadata_sample: {
        name: '',
        description: '',
        image: '',
      },
    },
  ],
})

export const actions = {
  async listOwnedIds(
    { commit, dispatch, state, rootState },
    { wa, selectedProjects, to, from }
  ) {
    // const ownedIds =  await dispatch('relayer-erc721/listERC721Ids', {...project , wa : rootState.connector.account }, {root: true} );

    try {
      await Promise.all(
        selectedProjects.map(async (project) => {
          let ownedIds = []

          switch (project.contractType) {
            // case 'ERC20':
            //   ownedIds = await dispatch(
            //     'relayer-erc20/listERC20',
            //     { ...project, wa },
            //     { root: true }
            //   )
            //   break
            case 'ERC721':
              ownedIds = await dispatch(
                'relayer-erc721/listERC721',
                { ...project, wa },
                { root: true }
              )
              break
            case 'ERC1155':
              ownedIds = await dispatch(
                'relayer-erc1155/listERC1155',
                { ...project, wa },
                { root: true }
              )
              break

            default:
              break
          }

          const listDetails = (
            await dispatch(
              'details/getListDetails',
              {
                listIds: ownedIds,
                contractAddress: project.contractAddress,
                contractType: project.contractType,
              },
              { root: true }
            )
          ).filter(Boolean)

          if (listDetails) {
            if (to) {
              traderLog('projectToItems : ', listDetails)
              commit('updateProject', {
                project_name: project.project_name,
                projectToItems: listDetails,
              })
            }
            if (from) {
              traderLog('projectFromItems : ', listDetails)
              commit('updateProject', {
                project_name: project.project_name,
                projectFromItems: listDetails,
              })
            }
          }
        })
      )

      // TODO: get asst name from heruko api
    } catch (error) {
      traderError('Error listing ids -> ', error)
    }
  },
}

export const mutations = {
  itemFrom(state, value) {
    state.itemFrom = value
  },
  itemTo(state, value) {
    state.itemTo = value
  },
  tradeSelectedItemTo(state, value) {
    state.tradeSelectedItemTo = value
  },
  tradeSelectedItemFrom(state, value) {
    state.tradeSelectedItemFrom = value
  },
  projectToItems(state, value) {
    state.projectToItems = value
  },
  projectFromItems(state, value) {
    state.projectFromItems = value
  },
  updateProject(state, updatedItem) {
    state.projects = [
      ...state.projects.map((item) =>
        item.project_name !== updatedItem.project_name
          ? item
          : { ...item, ...updatedItem }
      ),
    ]
  },
}