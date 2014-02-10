# -*- coding: utf-8 -*-
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
# country_list = [
#   [ "Deutschland", 81831000 ],
#   [ "Frankreich", 65447374 ],
#   [ "Belgien", 10839905 ],
#   [ "Niederlande", 16680000 ]
# ]

# country_list.each do |country|
#   Country.create( :name => country[0], :population => country[1] )
# end

ubuntu = OsType.create(name: 'Ubuntu', family: 'ubuntu', desc: 'ubuntu', username: 'ubuntu')
debian = OsType.create(name: 'Debian', family: 'debian', desc: 'debian', username: 'root')
centos = OsType.create(name: 'Centos', family: 'centos', desc: 'centos', username: 'root')
redhat = OsType.create(name: 'Redhat', family: 'redhat', desc: 'redhat', username: 'root')
windows = OsType.create(name: 'Windows', family: 'windows', desc: 'windows', username: 'administrator')


ubuntu_list = [
               ['Ubuntu 12.04 64位', 'itel', 64, '882ddca0-2637-4a34-8cec-5506717ce29b'],
               ['Ubuntu 12.04 32位', 'itel', 32, '882ddca0-2637-4a34-8cec-5506717ce29b'],
               ['Ubuntu 13.04 64位', 'itel', 64, '882ddca0-2637-4a34-8cec-5506717ce29b'],
               ['Ubuntu 13.04 64位', 'itel', 32, '882ddca0-2637-4a34-8cec-5506717ce29b'],
              ]

debian_list = [
               ['Debian 7.0 64位', 'itel', 64, '882ddca0-2637-4a34-8cec-5506717ce29b'],
               ['Debian 7.0 32位', 'itel', 32, '882ddca0-2637-4a34-8cec-5506717ce29b']
              ]

centos_list = [ 
               ['CentOS 6.4 64位', 'itel', 64, '882ddca0-2637-4a34-8cec-5506717ce29b'],
               ['CentOS 6.4 32位', 'itel', 32, '882ddca0-2637-4a34-8cec-5506717ce29b'],
               ['CentOS 6.3 64位', 'itel', 64, '882ddca0-2637-4a34-8cec-5506717ce29b'],
               ['CentOS 6.3 32位', 'itel', 32, '882ddca0-2637-4a34-8cec-5506717ce29b'],
               ['CentOS 6.0 64位', 'itel', 64, '882ddca0-2637-4a34-8cec-5506717ce29b'],
               ['CentOS 6.0 32位', 'itel', 32, '882ddca0-2637-4a34-8cec-5506717ce29b']
              ]

redhat_list = [
               ['Redhat 6.4 64位', 'itel', 64, '882ddca0-2637-4a34-8cec-5506717ce29b'],
               ['Redhat 6.4 32位', 'itel', 32, '882ddca0-2637-4a34-8cec-5506717ce29b'],
               ['Redhat 6.3 64位', 'itel', 64, '882ddca0-2637-4a34-8cec-5506717ce29b'],
               ['Redhat 6.3 32位', 'itel', 32, '882ddca0-2637-4a34-8cec-5506717ce29b']
              ]

windows_list = [
                ['Windows 2008 64位', 'itel', 64, '882ddca0-2637-4a34-8cec-5506717ce29b'],
                ['Windows 2008 32位', 'itel', 32, '882ddca0-2637-4a34-8cec-5506717ce29b'],
                ['Windows 2003 64位', 'itel', 64, '882ddca0-2637-4a34-8cec-5506717ce29b'],
                ['Windows 2003 32位', 'itel', 32, '882ddca0-2637-4a34-8cec-5506717ce29b'],
               ]


ubuntu_list.each do | os |
  OperatingSystem.create(:name => os[0], :cpuarc => os[1], :cpubit => os[2], :image_id => os[3], :os_type_id => ubuntu.id)
  end

debian_list.each do | os |
  OperatingSystem.create(:name => os[0], :cpuarc => os[1], :cpubit => os[2], :image_id => os[3], :os_type_id => debian.id)
  end

centos_list.each do | os |
  OperatingSystem.create(:name => os[0], :cpuarc => os[1], :cpubit => os[2], :image_id => os[3], :os_type_id => centos.id)
  end

redhat_list.each do | os |
  OperatingSystem.create(:name => os[0], :cpuarc => os[1], :cpubit => os[2], :image_id => os[3], :os_type_id => redhat.id)
  end

windows_list.each do | os |
  OperatingSystem.create(:name => os[0], :cpuarc => os[1], :cpubit => os[2], :image_id => os[3], :os_type_id => windows.id)
end


flavors_list = [
                ['小型A','micro1',1,512,'1'],
                ['小型B','micro2',1,1024,'1'],
                ['小型C','micro3',1,2048,'1'],
                ['unkown','micro4',2,1024,'1'],
                ['unkown','micro5',2,2048,'1'],
                ['中型A','small1',2,4096,'1'],
                ['unkown','small2',2,8192,'1'],
                ['unkown','small3',2,16384,'1'],
                ['unkown','small4',4,2048,'1'],
                ['unkown','small5',4,4096,'1'],
                ['unkown','small6',4,6144,'1'],
                ['中型B','medium1',4,8192,'1'],
                ['unkown','medium2',4,16384,'1'],
                ['unkown','medium3',8,4096,'1'],
                ['unkown','medium4',8,8192,'1'],
                ['中型C','medium5',8,16384,'1'],
                ['unkown','medium6',8,32768,'1'],
                ['unkown','large1',16,8192,'1'],
                ['大型A','large2',16,16384,'1'],
                ['大型B','large3',16,32768,'1'],
                ['unkown','large4',16,65536,'1'],
                ['unkown','xlarge1',32,16384,'1'],
                ['unkown','xlarge2',32,32768,'1'],
                ['大型C','xlarge3',32,65536,'1']
               ]

flavors_list.each do |f|
  Flavor.create(alias: f[0], name: f[1], vcpus: f[2], memory_mb: f[3], flavorid: f[4])
end
