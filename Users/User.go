package Users

import "github.com/gocql/gocql"

type User struct {
	Id                      gocql.UUID `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Name                    string     `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	Email                   string     `protobuf:"bytes,3,opt,name=email,proto3" json:"email,omitempty"`
	Password                string     `protobuf:"bytes,4,opt,name=password,proto3" json:"password,omitempty"`
	Created                 uint64     `protobuf:"varint,5,opt,name=created,proto3" json:"created,omitempty"`
	Updated                 uint64     `protobuf:"varint,6,opt,name=updated,proto3" json:"updated,omitempty"`
	Rememberme              bool       `protobuf:"varint,7,opt,name=rememberme,proto3" json:"rememberme,omitempty"`
	VerificationCode        uint32     `protobuf:"varint,8,opt,name=verification_code,json=verificationCode,proto3" json:"verification_code,omitempty"`
	VerificationCodeCreated uint64     `protobuf:"varint,9,opt,name=verification_code_created,json=verificationCodeCreated,proto3" json:"verification_code_created,omitempty"`
}
