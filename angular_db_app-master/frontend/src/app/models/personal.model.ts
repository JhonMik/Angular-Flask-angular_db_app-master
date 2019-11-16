export interface PersonListModel {
  userid: number;
  name: string;
  branchOfGov: string;
  organizations: any;
  ministry: string;
  position: string;
  gender: string;
  age: string;
  ancestry: string;
  ethnicity: string;
  imageurl: string;
}

export interface PersonDetailModel {
  userid: number;
  name: string;
  branchOfGov: string;
  organizations: any;
  ministry: string;
  position: string;
  gender: string;
  age: string;
  ancestry: string;
  ethnicity: string;
  imageurl: string;
}



export interface UserAvartaColumn {
  id: PersonListModel[];
}
