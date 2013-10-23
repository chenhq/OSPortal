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


